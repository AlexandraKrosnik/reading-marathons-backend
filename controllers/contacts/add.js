const { BadRequest } = require("http-errors");
const { Contact } = require("../../models");

const add = async (req, res) => {
  const { id } = req.user;
  const contact = await Contact.create({ ...req.body, owner: id });
  if (!contact) {
    throw BadRequest(
      `Contact with phone=${req.body.phone} has already been added!`
    );
  }

  res.status(201).json({
    message: "Success",
    code: 201,
    data: {
      contact,
    },
  });
};

module.exports = add;
