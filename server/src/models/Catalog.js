module.exports = (sequelize, DataTypes) => {
  const Catalog = sequelize.define('Catalog', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    catalogName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Catalog.associate = (models) => {
    Catalog.belongsTo(models.User, { foreignKey: 'userId' });
    Catalog.belongsToMany(models.Conversation, {
      through: 'CatalogsToConversations',
      foreignKey: 'catalogId',
      as: 'chats',
    });
  };

  return Catalog;
};
