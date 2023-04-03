const _ = require('lodash');

const ItemsRouter = require('express').Router();

const { queryResults, userExtractor } = require('../utils/multer.js');

const Item = require('../models/item.js');
const Option = require('../models/option.js');

ItemsRouter.get('/', queryResults(Item), async (req, res) => {
  return res.send(res.queryResults);
});

ItemsRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  const item = Item.findById(id);
  if (!item)
    return res.status(404).send({ success: false, message: `Item with id: ${id} not found` });

  return res.send(item);
});

ItemsRouter.post('/', userExtractor, async (req, res, next) => {
  const body = req.body;
  
  const optionIds = body.options.map(async option => {
    const option = new Option({
      contributor: req.user.id,
      method: option.method,
      likers: [],
      dislikers: []
    });

    const savedOption = await option.save();

    return savedOption.id;
  });

  const item = new Item({
    name: body.name,
    options: optionIds
  });

  const savedItem = await item.save();

  return res.send(savedItem);
});

ItemsRouter.put('/:id', userExtractor, async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const item = Item.findById(id).populate('options');
  if (!item)
    return res.status(404).send({ success: false, message: `Item with id: ${id} not found` });

  const optionIds = body.options.map(async option => {
    if (option)
  });
});

module.exports = ItemsRouter;
