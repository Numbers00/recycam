const ItemsRouter = require('express').Router();

const { queryResults } = require('../utils/multer.js');

const Item = require('../models/item.js');

ItemsRouter.get('/', queryResults(Item), async (req, res) => {
  return res.send(res.queryResults);
});

ItemsRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  const item = Item.findById(id);
  if (!item)
    return res.status(404).send({ success: false, message: 'User not found' });

  return res.send(item);
});

module.exports = ItemsRouter;
