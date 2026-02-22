module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Contests', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    contestType: {
      type: DataTypes.ENUM('name', 'tagline', 'logo'),
      allowNull: false,
    },
    fileName: { type: DataTypes.STRING, allowNull: true },
    originalFileName: { type: DataTypes.STRING, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: true },
    typeOfName: { type: DataTypes.STRING, allowNull: true },
    industry: { type: DataTypes.STRING, allowNull: true },
    focusOfWork: { type: DataTypes.TEXT, allowNull: true },
    targetCustomer: { type: DataTypes.TEXT, allowNull: true },
    styleName: { type: DataTypes.STRING, allowNull: true },
    nameVenture: { type: DataTypes.STRING, allowNull: true },
    typeOfTagline: { type: DataTypes.STRING, allowNull: true },
    brandStyle: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false },
    prize: { type: DataTypes.DECIMAL, allowNull: false },
    priority: { type: DataTypes.INTEGER, allowNull: false },
    orderId: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
    tableName: 'Contests',
  });
};
