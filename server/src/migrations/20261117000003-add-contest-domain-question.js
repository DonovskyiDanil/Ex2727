module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Contests', 'domainQuestion', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Contests', 'domainQuestion');
  },
};
