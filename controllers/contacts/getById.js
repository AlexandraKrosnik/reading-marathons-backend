const { Contact } = require("../../models");
const { NotFound } = require("http-errors");

const getById = async (req, res) => {
  const { id } = req.user;
  const { contactId } = req.params;
  console.log(contactId);
  const contact = await Contact.findOne({ _id: contactId, owner: id });
  if (!contact) {
    throw NotFound(`Contact with id=${contactId} not found!`);
  }
  res.json({
    message: "Success",
    code: 200,
    data: {
      contact,
    },
  });
};

module.exports = getById;
