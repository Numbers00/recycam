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

const filterResults = (model) => {
  return (req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    const { page, limit, sortKey, sortType, ...options } = req.query;

    // filtering the model
    const filteredModel = model.filter((item) => {
      let result = true;
      for (const key in options) {
        if (!Object.keys(item).includes(_removeMinMax(key)))
          continue;

        if (options[key] === '' || options[key] === 'undefined' || options[key] === 'null')
          continue;

        if (key.toLowerCase().includes('date')) {
          const numDash = (options[key].match(/-/g) || []).length;
          const dateFilterMode = (() => {
            switch (numDash) {
            case 0:
              return 'year';
            case 1:
              return 'month';
            case 2:
              return 'date';
            default:
              return 'date';
            }
          })();

          // startOf autoformats date
          // e.g., 2014 -> 2014-01-01
          const dateFilter = moment(options[key]).startOf(dateFilterMode);
          const filteredDate = moment(item[_removeMinMax(key)]);
          let condition = false;
          if (key.toLowerCase().includes('min'))
            condition = filteredDate.isAfter(dateFilter);
          else if (key.toLowerCase().includes('max'))
            condition = filteredDate.isBefore(dateFilter);
          else
            condition = filteredDate.isSame(dateFilter, 'date');
          if (!condition) {
            result = false;
            break;
          }
        } else if (/^\d[\d.]*$/.test(options[key]) && [0, 1].includes((options[key].match('.') || []).length)) {
          // option is either an integer or a decimal value
          if (item[key] !== parseFloat(options[key])) {
            result = false;
            break;
          }
        } else {
          // option is either a string or a boolean
          const formattedFilter = (() => {
            switch (options[key]) {
            case 'true':
            case 'True':
              return true;
            case 'false':
            case 'False':
              return false;
            default:
              return options[key];
            }
          })();
          if (item[key] !== formattedFilter) {
            result = false;
            break;
          }
        }
      }
      return result;
    });

    res.filteredResults = filteredModel;
    next();
  };
};

const sortResults = () => {
  return (req, res, next) => {
    const { sortKey, sortType } = req.query;
    if (!(sortKey || sortType)) {
      res.sortedResults = res.filteredResults;
      return next();
    }

    const capSortKey = _capitalizeFirstLetter(sortKey);
    res.filteredResults = res.filteredResults.map((item) => {
      return {
        ...item,
        [`DateFormat${capSortKey}`]: new Date(item[sortKey])
      };
    });
    const sortedResults = (() => {
      switch (sortType) {
      case 'A to Z':
        return _.orderBy(res.filteredResults, [`dateFormat${capSortKey}`], ['asc']);
      case 'Z to A':
        return _.orderBy(res.filteredResults, [`dateFormat${capSortKey}`], ['desc']);
      case 'Latest to Oldest':
        return _.orderBy(res.filteredResults, [`dateFormat${capSortKey}`], ['desc']);
      case 'Oldest to Latest':
        return _.orderBy(res.filteredResults, [`dateFormat${capSortKey}`], ['asc']);
      default:
        return res.filteredResults;
      }
    })();

    res.sortedResults = sortedResults;
    next();
  };
};

// code adapted from and thanks to https://www.javacodegeeks.com/how-to-do-pagination-in-node-js.html
const paginateResults = () => {
  // middleware function
  return (req, res, next) => {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 32);

    const sortedModel = res.sortedResults;

    // calculating the starting and ending index
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < sortedModel.length) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.total = sortedModel.length;
    results.results = sortedModel.slice(startIndex, endIndex);

    res.paginatedResults = results;
    next();
  };
};
// end adapted code

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
  filterResults,
  sortResults,
  paginateResults,
  upload,
  requestLogger,
  unknownEndpoint,
  errorHandler
};
