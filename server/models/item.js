const mongoose = require('mongoose');
const validator = require('validator');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'the item\'s name is required'
  },
  options: {
    type: [optionSchema]
  }
});

itemSchema.set('toJSON', {
  transform: (document, returnedObject)  => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
