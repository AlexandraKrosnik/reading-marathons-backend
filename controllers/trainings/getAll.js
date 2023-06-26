const { Training, Book } = require("../../models");
const checkAndUpdateTrainingStatus = require("../../utils/checkAndUpdateTrainingStatus");
const { InternalServerError } = require("http-errors");
const getAll = async (req, res) => {
  const { id } = req.user;
  const trainings = await Training.find({ user: id }).populate(
    "statistics.book"
  );

  const updatedBooks = (training) => {
    return Promise.all(
      training.statistics.map(async ({ book }) => {
        const updatedBook = await Book.findByIdAndUpdate(
          book._id,
          {
            inTraining: false,
          },
          {
            new: true,
          }
        );

        if (!updatedBook) {
          throw new InternalServerError(
            `Something went wrong. Check the entered data!`
          );
        }
        return updatedBook;
      })
    );
  };

  const updatedTrainings = await Promise.all(
    trainings.map(async (training) => {
      const updatedTrainingStatus = checkAndUpdateTrainingStatus(training);

      if (updatedTrainingStatus === training.status) {
        return training;
      }
      if (updatedTrainingStatus === "finished") {
        updatedBooks(training);
      }
      const updatedTrainingDocument = await Training.findByIdAndUpdate(
        training._id,
        { status: updatedTrainingStatus },
        { new: true }
      );

      if (!updatedTrainingDocument) {
        throw new InternalServerError("Something went wrong");
      }

      return updatedTrainingDocument;
    })
  );

  res.status(200).json({
    message: "Success",
    code: 200,
    data: {
      trainings: updatedTrainings,
    },
  });
};

module.exports = getAll;
