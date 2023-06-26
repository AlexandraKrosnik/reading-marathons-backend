const { Training } = require("../../models");
const { NotFound } = require("http-errors");

const getById = async (req, res) => {
  const { id } = req.user;
  const { trainingId } = req.params;
  const training = await Training.findOne({
    _id: trainingId,
    user: id,
  }).populate("statistics.book");
  if (!training) {
    throw NotFound(`Book with id=${trainingId} not found!`);
  }
  res.json({
    message: "Success",
    code: 200,
    data: {
      training,
    },
  });
};

module.exports = getById;
