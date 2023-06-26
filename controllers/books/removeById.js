const { Book, Training } = require("../../models");
const { NotFound, NotImplemented, BadRequest } = require("http-errors");
const defaultImage = require("../../utils/defaultBookCover");
const { cloudinary } = require("../../utils/cloudinary");

const removeById = async (req, res) => {
  const { id } = req.user;
  const { bookId } = req.params;
  // const book = await Book.findOne({ _id: bookId, user: id });
  const book = await Book.findOneAndDelete({ _id: bookId, user: id });
  if (!book) {
    throw NotFound(`Book with id=${bookId} not found!`);
  }
  const imageId = book.image.public_id;
  if (defaultImage.public_id !== imageId) {
    await cloudinary.uploader.destroy(imageId);
  }

  if (book.inTraining) {
    const trainings = await Training.find({ "books.book": bookId });
    try {
      await Promise.all(
        trainings.map(async ({ _id: trainingId, books }) => {
          console.log(books.length);
          if (books.length === 1) {
            const deletedTraining = await Training.findOneAndRemove({
              _id: trainingId,
              user: id,
            });
            if (!deletedTraining) {
              throw NotFound(`Book with id=${trainingId} not found!`);
            }
            return deletedTraining;
          }
          const updatedBooks = books.filter(
            ({ book }) => book.toString() !== bookId
          );
          const updatedTraining = await Training.findByIdAndUpdate(
            trainingId,
            {
              books: updatedBooks,
            },
            {
              new: true,
            }
          );
          if (!updatedTraining) {
            throw NotImplemented(`Something went wrong!`);
          }
          return updatedTraining;
        })
      );
    } catch (error) {
      throw BadRequest(error.message);
    }
  }

  res.json({
    message: "Success",
    code: 200,
    data: {
      book,
    },
  });
};

module.exports = removeById;
