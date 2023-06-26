const { Contact } = require("../../models");
const { NotFound } = require("http-errors");

const updateById = async (req, res) => {
  const { id } = req.user;
  const { contactId } = req.params;

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: id },
    req.body,
    {
      new: true,
    }
  );
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

module.exports = updateById;
