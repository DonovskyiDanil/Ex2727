module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'firstName', //
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'lastName', //
      },
      displayName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'displayName', //
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'anon.png',
      },
      role: {
        // Добавляем admin и moderator, как в твоем SQL
        type: Sequelize.ENUM('customer', 'creator', 'admin', 'moderator'),
        allowNull: false,
      },
      balance: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      accessToken: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'accessToken', //
      },
      rating: {
        // В SQL double precision — это DOUBLE
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
    })
      .then(() => queryInterface.addConstraint('Users', {
        type: 'check',
        fields: ['balance'],
        name: 'Users_balance_ck', // Имя из твоего SQL скрипта
        where: {
          balance: {
            [Sequelize.Op.gte]: 0,
          },
        },
      }));
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Users');
  },
};
