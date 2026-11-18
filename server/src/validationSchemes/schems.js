const yup = require('yup');

module.exports.registrationSchem = yup.object().shape({
  firstName: yup.string().required().min(1),
  lastName: yup.string().required().min(1),
  displayName: yup.string().required().min(1),
  email: yup.string().email().required().min(4),
  password: yup.string().required().min(1),
  role: yup.string().matches(/(customer|creator)/).required(),
});

module.exports.loginSchem = yup.object().shape({
  email: yup.string().email().required().min(4),
  password: yup.string().required().min(1),
});

module.exports.paymentSchem = yup.object().shape({
  // Номер карты (16-19 цифр, возможно с пробелами)
  number: yup.string()
    .required()
    .matches(/^[0-9\s]{16,19}$/, 'Неверный формат номера карты'),

  // Имя как в базе (yriy), минимум 1 символ
  name: yup.string()
    .required()
    .min(1),

  // Строго MM/YY (например, 09/26)
  expiry: yup.string()
    .required()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Формат даты должен быть MM/YY'),
  // Код безопасности (3 или 4 цифры)
  cvc: yup.string()
    .required()
    .min(3)
    .max(4),
});

module.exports.contestSchem = yup.object().shape({
  contestType: yup.string().matches(/(name|logo|tagline)/).required(),
  fileName: yup.string().min(1),
  originalFileName: yup.string().min(1),
  title: yup.string().required().min(1),
  typeOfName: yup.string().min(1),
  industry: yup.string().required().min(1),
  focusOfWork: yup.string().required().min(1),
  targetCustomer: yup.string().required().min(1),
  styleName: yup.string().min(1),
  nameVenture: yup.string().min(1),
  typeOfTagline: yup.string().min(1),
  brandStyle: yup.string().min(1),
});
