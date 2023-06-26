const { Contact } = require("../../models");
const { NotFound } = require("http-errors");

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { id } = req.user;
  const { favorite } = req.body;
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: id },
    { favorite },
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

module.exports = updateFavorite;
