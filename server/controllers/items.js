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
    if (item.optionIds.includes(option.id)) {
      await Option.findByIdAndUpdate(
        option.id,
        option,
        { new: true, runValidators: true, context: 'query' }
      );

      return option.id;
    }
    else {
      const newOption = new Option({
        contributor: req.user.id,
        method: option.method,
        likers: [],
        dislikers: []
      });

      const savedOption = await newOption.save();

      return savedOption.id;
    }
  });

  await Item.findByIdAndUpdate(
    id,
    { ...item, options: optionIds },
    { new: true, runValidators: true, context: 'query' }
  );
  response.status(200).end();
});

module.exports = ItemsRouter;
