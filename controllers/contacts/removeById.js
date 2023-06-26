const { Contact } = require("../../models");
const { NotFound } = require("http-errors");

const removeById = async (req, res) => {
  const { id } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.findOneAndRemove({ _id: contactId, owner: id });
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

module.exports = removeById;
