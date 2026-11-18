module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.message ===
    'new row for relation "Banks" violates check constraint "Banks_balance_ck"' ||
    err.message ===
    'new row for relation "Users" violates check constraint "Users_balance_ck"') {
    err.message = 'Not Enough money';
    err.code = 406;
  }
  if (!err.message || !err.code) {
    res.status(500).send('Server Error');
<<<<<<< HEAD
  } else if (err.code >= 500) {
    res.status(err.code).send('Server Error');
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  } else {
    res.status(err.code).send(err.message);
  }
};
