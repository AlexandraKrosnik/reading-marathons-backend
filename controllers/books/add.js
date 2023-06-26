const { BadRequest } = require("http-errors");
const { Book } = require("../../models");
const { cloudinary } = require("../../utils/cloudinary");
const defaultImage = require("../../utils/defaultBookCover");

const add = async (req, res) => {
  const { id } = req.user;

  const { title, author, image } = req.body;

  const bookAdded = await Book.findOne({ title, author, user: id });
  if (bookAdded) {
    throw BadRequest(
      `Book with title=${title}, author=${author} has already been added!`
    );
  }
  let newBookImage;
  if (image) {
    const { url, public_id } = await cloudinary.uploader.upload(image, {
      upload_preset: "book_images",
    });
    newBookImage = {
      url,
      public_id,
    };
  }

  const book = await Book.create({
    ...req.body,
    user: id,
    image: image ? newBookImage : defaultImage,
  });
  if (!book) {
    throw BadRequest(`Check the entered data!`);
  }

  res.json({
    message: "Success",
    code: 200,
    data: {
      data: book,
    },
  });
};

module.exports = add;
