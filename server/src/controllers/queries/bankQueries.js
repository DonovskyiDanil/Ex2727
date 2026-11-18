const db = require('../../models');
const BankDeclineError = require('../../errors/BankDeclineError');
const { Sequelize } = require('sequelize');

module.exports.updateBankBalance = async ({ number, cvc, expiry, price }, transaction) => {
  const amount = Number(price);
  if (!number || !cvc || !expiry || !Number.isFinite(amount) || amount === 0) {
    throw new Error('Недостаточно данных для обновления баланса');
  }

  const where = { cardNumber: number, cvc, expiry };
  if (amount < 0) {
    where.balance = { [Sequelize.Op.gte]: Math.abs(amount) };
  }

  const [updatedCount, updatedRows] = await db.Banks.update(
    { balance: Sequelize.literal(`balance + ${amount.toFixed(2)}`) },
    {
      where,
      returning: true,
      transaction,
    },
  );

  if (updatedCount !== 1) {
    throw new BankDeclineError('Bank decline transaction');
  }

  return updatedRows[0]; // возвращаем обновленную запись
};
