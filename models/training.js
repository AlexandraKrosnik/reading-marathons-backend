const { Schema, model } = require("mongoose");
const Joi = require("joi");

const trainingSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  start: {
    type: Date,
    require: true,
  },
  finish: {
    type: Date,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  statistics: [
    {
      book: {
        type: Schema.Types.ObjectId,
        ref: "book",
        require: true,
      },
      statisticsPages: {
        type: {
          readPages: {
            type: Number,
            require: [true, "Please, write pages you have read!"],
          },
          initialPage: {
            type: Number,
            require: [true, "Please, write initial page!"],
          },
        },
      },
      result: {
        type: [
          {
            date: {
              type: Date,
              require: [true, "Please, enter date!"],
            },
            pages: {
              type: Number,
              require: [true, "Please, write pages you have read!"],
            },
          },
        ],
      },
    },
  ],
  status: {
    type: String,
    require: true,
  },
});

const joiSchema = Joi.object({
  start: Joi.date().required(),
  finish: Joi.date().required(),
  title: Joi.string().required(),

  statistics: Joi.object({
    book: Joi.string(),
    statisticsPages: Joi.object({
      readPages: Joi.number().required().messages({
        "any.required": "Please, write pages you have read!",
        "number.base": "Please provide a valid number for readPages",
      }),
      initialPage: Joi.number().required().messages({
        "any.required": "Please, write initial page!",
        "number.base": "Please provide a valid number for initialPage",
      }),
    }),
    result: Joi.array().items({
      date: Joi.date().required(),
      pages: Joi.number().required(),
    }),
  }),

  status: Joi.string().required(),
});
const joiSchemaAddTraining = Joi.object({
  start: Joi.date().required(),
  finish: Joi.date().required(),
  title: Joi.string().required(),
  books: Joi.array().items(Joi.string()).min(1),
  booksToRestartReading: Joi.array().items(Joi.string()),
});

const joiSchemaAddStatistic = Joi.object({
  book: Joi.string().required(),
  date: Joi.date().required(),
  pages: Joi.number().required(),
});

const Training = model("training", trainingSchema);

module.exports = {
  Training,
  joiSchema,
  joiSchemaAddTraining,
  joiSchemaAddStatistic,
};
