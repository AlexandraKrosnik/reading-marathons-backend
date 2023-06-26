const { Training, Book } = require("../../models");

const checkAndUpdateTrainingStatus = require("../../utils/checkAndUpdateTrainingStatus");
const updateStatistic = async (req, res) => {
  const { id } = req.user;
  const { book: bookId, date, pages } = req.body;
  const { trainingId } = req.params;

  const updateTrainingResult = async () => {
    try {
      const training = await Training.findOne({
        _id: trainingId,
        user: id,
      }).populate("statistics.book");
      if (!training) {
        throw new Error("Training not found");
      }

      const isBook = training.statistics.find(
        ({ book: bookItem }) => bookItem._id.toString() === bookId
      );

      if (!isBook) {
        throw new Error("Book not found");
      }

      const readPages =
        Number(isBook.statisticsPages.readPages) + Number(pages);

      const newPages =
        readPages > Number(isBook.book.pages) ? isBook.book.pages : readPages;
      isBook.result = [...isBook.result, { date, pages }];

      isBook.statisticsPages.readPages = newPages;
      await training.save();
      return training;
    } catch (error) {
      console.error("Error updating training result:", error);
      throw error;
    }
  };

  const updateBook = async () => {
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error("Book not found");
      }
      let readPages = Number(book.leftPages) + Number(pages);
      if (readPages > book.pages) {
        readPages = book.pages;
      }

      if (readPages === book.pages) {
        book.status = "already";
        book.inTraining = false;
        book.readTimes += 1;
      }
      book.leftPages = readPages;

      await book.save();
    } catch (error) {
      console.error("Error updating training result:", error);
      throw error;
    }
  };
  const updateStatus = async () => {
    try {
      const training = await Training.findOne({
        _id: trainingId,
        user: id,
      }).populate("statistics.book");
      const newStatus = checkAndUpdateTrainingStatus(training);
      if (newStatus !== training.status) {
        training.status = newStatus;
      }
      await training.save();
      return training;
    } catch (error) {
      console.error("Error updating training result:", error);
      throw error;
    }
  };

  await updateTrainingResult();
  await updateBook();
  const updatedData = await updateStatus();

  res.json({
    message: "Success",
    code: 200,
    data: {
      updatedData,
    },
  });
};
module.exports = updateStatistic;
