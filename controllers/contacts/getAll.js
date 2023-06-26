const { Contact } = require("../../models");
const getAll = async (req, res) => {
  const { id } = req.user;
  const { page = 1, limit = 5, favorite = false } = req.query;
  console.log(favorite);
  const skip = (page - 1) * limit;

  const contacts = await Contact.find(
    favorite ? { owner: id, favorite } : { owner: id },
    "",
    {
      skip,
      limit: Number(limit),
    }
  ).populate("owner", "_id email subscription");

  res.status(200).json({
    message: "Success",
    code: 200,
    data: {
      contacts,
    },
  });
};

module.exports = getAll;
