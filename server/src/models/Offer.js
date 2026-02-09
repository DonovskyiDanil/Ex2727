module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define('Offers', {
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
    contestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    originalFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'), // Завдання 12
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    timestamps: false,
  });

  Offer.associate = function (models) {
    // ОБ'ЄДНУЄМО асоціації тут
    Offer.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
    Offer.belongsTo(models.Contest, { foreignKey: 'contestId', targetKey: 'id' });
  };

  return Offer;
};
