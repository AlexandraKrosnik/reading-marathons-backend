const { Book } = require("../../models");
const { BadRequest, InternalServerError } = require("http-errors");
const { cloudinary } = require("../../utils/cloudinary");

const updateBook = async (req, res) => {
  const { bookId } = req.params;
  const { id } = req.user;
  const { body } = req;
  const bookPreviousVersion = await Book.findOne({ _id: bookId, user: id });
  if (!bookPreviousVersion) {
    throw BadRequest(
      `Book with title=${body.title}, author=${body.author} has already been added!`
    );
  }
  const isImageSame = body.image === bookPreviousVersion.image.url;
  let newImage;
  if (!isImageSame) {
    const { url, public_id } = await cloudinary.uploader.upload(
      body.image,
      { public_id: bookPreviousVersion.image.public_id },

      function (error, result) {
        console.log(result, error);
      },
      true
    );
    newImage = {
      url,
      public_id,
    };
  }
  const bookUpdate = {
    ...body,
    image: newImage || bookPreviousVersion.image,
  };
  const book = await Book.findByIdAndUpdate(bookId, bookUpdate, { new: true });
  if (!book) {
    throw InternalServerError(`Something went wrong. Check the entered data!`);
  }
  res.json({
    message: "Success",
    code: 200,
    data: {
      data: book,
    },
  });
};

module.exports = updateBook;
