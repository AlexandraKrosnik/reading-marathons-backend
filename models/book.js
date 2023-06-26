const { Schema, model } = require("mongoose");
const Joi = require("joi");

const bookSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  title: {
    type: String,
    default: "none",
  },
  author: {
    type: String,
    default: "none",
  },
  publication: {
    type: String,
    required: [true, "Please, write publication year!"],
  },
  pages: {
    type: Number,
    required: [true, "Please, write pages in a book!"],
  },
  leftPages: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["plan", "already", "now"],
    default: "plan",
  },
  inTraining: {
    type: Boolean,
    default: false,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  readTimes: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
  },
  resume: {
    type: String,
  },
});

const joiSchema = Joi.object({
  title: Joi.string(),
  author: Joi.string(),
  publication: Joi.string().length(4).pattern(/^\d+$/).required(),
  pages: Joi.number().integer().required(),
  leftPages: Joi.number().integer(),
  status: Joi.string().valid("plan", "already", "now"),
  readTimes: Joi.number().integer(),
  inTraining: Joi.boolean(),
  image: Joi.string().allow(""),
  rating: Joi.number(),
  resume: Joi.string(),
});

const joiSchemaReviews = Joi.object({
  rating: Joi.number(),
  resume: Joi.string(),
});

const Book = model("book", bookSchema);

module.exports = { Book, joiSchema, joiSchemaReviews };
