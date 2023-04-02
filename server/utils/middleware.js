const _ = require('lodash');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');

const logger = require('./logger');

const middlewareHelper = require('../helpers/middleware.helper.js');

const config = require('./config.js');

const User = require('../models/user.js');

const tokenExtractor = (req, res, next) => {
  req.token = '';
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ success: false, message: 'token missing or invalid' });
  }

  const decodedJwt = middlewareHelper.parseJwt(req.token);
  if (Date.now() >= decodedJwt.exp * 1000) {
    return res.status(401).json({ success: false, message: 'token expired, please reload the page' });
  }

  const decodedToken = jwt.verify(req.token, config.JWT_SECRET);
  if (!decodedToken.id && !decodedToken.email) {
    return res.status(401).json({ success: false, message: 'token missing or invalid' });
  }

  if ('id' in decodedToken && decodedToken.id)
    req.user = User.findByid(decodedToken.id);
  else if ('email' in decodedToken && decodedToken.email)
    req.user = User.find((user) => user.email === decodedToken.email);
  next();
};

const nonBlockingUserExtractor = async (req, res, next) => {
  if (!req.token) return next();

  const decodedJwt = middlewareHelper.parseJwt(req.token);
  if (Date.now() >= decodedJwt.exp * 1000) return next();

  const decodedToken = jwt.verify(req.token, config.JWT_SECRET);
  if (!decodedToken.id && !decodedToken.email) return next();

  if ('id' in decodedToken && decodedToken.id)
    req.user = users.find((user) => user.id === decodedToken.id);
  else if ('email' in decodedToken && decodedToken.email)
    req.user = users.find((user) => user.email === decodedToken.email);
  next();
};

// _ prepended to function means it's internal to this file
const _capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const _removeMinMax = (str) => {
  return str.replace(/[mM]in/, '').replace(/[mM]ax/, '');
};

const queryResults = (model) => {
  return async (req, res, next) => {
    const { page, limit, sortKey = '_id', sortType = 'asc', ...options } = req.query;

    const sort = { [sortKey]: sortType === 'desc' ? -1 : 1 };

    // Build the query based on the filter options
    const query = {};
    for (const key in options) {
      if (key === 'q') {
        query.$text = { $search: options[key] };
      } else if (key.endsWith('_min')) {
        query[key.slice(0, -4)] = { $gte: options[key] };
      } else if (key.endsWith('_max')) {
        query[key.slice(0, -4)] = { $lte: options[key] };
      } else if (key.endsWith('_in')) {
        query[key.slice(0, -3)] = { $in: options[key].split(',') };
      } else {
        query[key] = options[key];
      }
    }

    // Retrieve the filtered data from the database
    let filteredModel;
    let total;

    if (page && limit) {
      filteredModel = await model
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean();

      total = await model.countDocuments(query);
    } else {
      filteredModel = await model
        .find(query)
        .sort(sort)
        .lean();

      total = filteredModel.length;
    }

    const results = {};
    if (!page || !limit) {
      res.queryResults = filteredModel;
      return next();
    }

    if ((page - 1) * limit > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    if (page * limit < total) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    results.total = total;
    results.results = filteredModel;

    res.queryResults = results;
    next();
  };
};


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.replaceAll(',', '44').replace(';', '59'));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    // accept file
    cb(null, true);
  } else {
    // reject file
    console.log('rejected file', file.mimetype, allowedTypes.includes(file.mimetype));
    cb(null, false);
  }
};

// 5mb maximum file size limit
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter
});

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  nonBlockingUserExtractor,
  queryResults,
  upload,
  requestLogger,
  unknownEndpoint,
  errorHandler
};