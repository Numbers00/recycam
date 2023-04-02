const mongoose = require('mongoose');
const validator = require('validator');

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'the item\'s name is required'
  },
  best_option: {
    name: {
      type: String,
      required: 'the best option\'s name is required'
    },
    description: {
      type: String,
      required: 'the best option\'s description is required'
    }
  },
  other_options: {
    type: [optionSchema],
    required: false
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
