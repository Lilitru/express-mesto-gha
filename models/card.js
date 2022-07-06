const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  }
}, { versionKey: false })

const cardModel = mongoose.model("card", cardSchema);
module.exports = cardModel;
