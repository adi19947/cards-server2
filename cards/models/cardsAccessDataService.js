const { createError } = require("../../utils/handleErrors");
const Card = require("./mongodb/card");
const config = require("config");
const DB = config.get("DB");



const createCard = async (normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      let card = new Card(normalizedCard);

      await card.save();
      return Promise.resolve(card);
    } catch (error) {
      error.status = 400;
      return createError("mongoose", error);
    }
  }
  else { return Promise.resolve("Create card not in mongodb"); }
};

const getCards = async () => {
  if (DB === "MONGODB") {
    try {
      const cards = await Card.find();
      return Promise.resolve(cards);
    } catch (error) {
      return createError("Mongoose", error);
    }
  } else {
    Promise.resolve("get cards not in mongodb");
  }
};

const getCard = async (cardId) => {
  if (DB === "MONGODB") {
    try {
      const card = await Card.findById(cardId);
      if (!card) throw new Error("Card not found");
      Promise.resolve(card);
    } catch (error) {
      error.status = 404;
      return createError("mongoose", error);
    }
  }
  else { return Promise.resolve("Get card not in mongodb"); }
};

const getMyCards = async (userId) => {
  if (DB === "MONGODB") {
    try {
      let cards = await Card.find({ user_id: userId });
      Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return createError("mongoose", error)
    }
  }
  else { return Promise.resolve("Get my cards not in mongodb"); }
};

const updateCard = async (cardId, normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findByIdAndUpdate(cardId, normalizedCard, {
        new: true,
      });
      if (!card) {
        throw new Error("The card with this id didnt found");
      }
      return Promise.resolve(card)
    } catch (error) {
      error.status = 400;
      return createError("mongoose", error);
    }
  }
  else { return Promise.resolve("Card updateCard not in mongodb"); }
};



const likeCard = async (cardId, userId) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findById(cardId);
      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      const cardLikes = card.likes.find(id => id === userId);

      if (!cardLikes) {
        card.likes.push(userId);
        card = await card.save();
        return Promise.resolve(card);
      }

      const cardFiltered = card.likes.filter(id => id !== userId);
      card.likes = cardFiltered;
      card = await card.save();
      return Promise.resolve(card);

    } catch (error) {
      error.status = 400;
      return createError("mongoose", error);
    }
  }
  else { return Promise.resolve("Card likeCard not in mongodb"); }
};


const deleteCard = async (cardId, user) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findById(cardId);

      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      if (!user.isAdmin && user._id !== card.user_id.toString())
        throw new Error(
          "Authorization Error: Only the user who created the business card or admin can delete this card"
        );
      card = await Card.findByIdAndDelete(cardId);
      return Promise.resolve(card);
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  return Promise.resolve("card deleted not in mongodb");
};

exports.createCard = createCard;
exports.getCards = getCards;
exports.getCard = getCard;
exports.getMyCards = getMyCards;
exports.updateCard = updateCard;
exports.likeCard = likeCard;
exports.deleteCard = deleteCard;
