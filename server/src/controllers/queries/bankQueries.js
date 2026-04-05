const db = require('../../models');
const BankDeclineError = require('../../errors/BankDeclineError');
const { Sequelize } = require('sequelize');

module.exports.updateBankBalance = async ({ number, cvc, expiry, price }, transaction) => {
  if (!number || !cvc || !expiry || price === undefined) {
    throw new Error('Недостаточно данных для обновления баланса');
  }

  // Обновляем баланс безопасно через Sequelize.literal
  const [updatedCount, updatedRows] = await db.Banks.update(
    { balance: Sequelize.literal(`balance + ${Number(price)}`) },
    {
      where: { cardNumber: number, cvc, expiry },
      returning: true,
      transaction,
    },
  );

  if (updatedCount !== 1) {
    throw new BankDeclineError('Bank decline transaction');
  }

  return updatedRows[0]; // возвращаем обновленную запись
};
