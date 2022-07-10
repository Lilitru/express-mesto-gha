const ERROR_CODE_400 = 400;
const ERROR_CODE_401 = 401;
const ERROR_CODE_403 = 403;
const ERROR_CODE_404 = 404;
const ERROR_CODE_409 = 409;
const ERROR_CODE_500 = 500;

const validateUrl = (value, helpers) => {
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;

  if (!regex.test(value)) {
    return helpers.error('Ссылка не валидна');
  }
  return value;
};

module.exports = {
  ERROR_CODE_400,
  ERROR_CODE_401,
  ERROR_CODE_403,
  ERROR_CODE_404,
  ERROR_CODE_409,
  ERROR_CODE_500,
  validateUrl,
};
