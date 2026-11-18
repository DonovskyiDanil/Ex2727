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
      field: 'userId', // Соответствие "userId" в SQL
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    contestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'contestId', // Соответствие "contestId" в SQL
      references: {
        model: 'Contests',
        key: 'id',
      },
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'fileName', //
    },
    originalFileName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'originalFileName', //
    },
    status: {
      // В SQL это character varying, поэтому используем STRING
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    tableName: 'Offers', // Строго как в pgAdmin
    timestamps: false,
  });

<<<<<<< HEAD
=======
  Offer.associate = function (models) {
    Offer.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
    Offer.belongsTo(models.Contest, { foreignKey: 'contestId', targetKey: 'id' });
  };
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

  return Offer;
};
