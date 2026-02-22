module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'firstName', //
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'lastName', //
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'displayName', //
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'anon.png',
    },
    role: {
      type: DataTypes.ENUM('customer', 'creator', 'admin', 'moderator'), // Должно совпадать с enum_Users_role в SQL
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL, //
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0, //
      },
    },
    accessToken: {
      type: DataTypes.TEXT,
      field: 'accessToken', //
    },
    rating: {
      type: DataTypes.DOUBLE, // double precision
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'Users', //
    timestamps: false, // В SQL нет полей createdAt/updatedAt для Users
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { foreignKey: 'sender', as: 'messages' });
    User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
    User.hasMany(models.Offer, { foreignKey: 'userId', as: 'offers' });
    User.hasMany(models.Contest, { foreignKey: 'userId', as: 'contests' });
    User.hasMany(models.Catalog, { foreignKey: 'userId', as: 'catalogs' });
    User.belongsToMany(models.Conversation, {
      through: models.ConversationParticipant,
      foreignKey: 'userId',
      otherKey: 'conversationId',
      as: 'chats',
    });
  };

  return User;
};
