module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Ratings', {
    offerId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Составной ключ
      allowNull: false,
      field: 'offerId', // Соответствие кавычкам в SQL
      references: {
        model: 'Offers',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Составной ключ
      allowNull: false,
      field: 'userId', // Соответствие кавычкам в SQL
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    mark: {
      type: DataTypes.DOUBLE, // double precision в SQL
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
  }, {
    tableName: 'Ratings', // Строго как в pgAdmin
    timestamps: false,
  });

<<<<<<< HEAD
=======
  Rating.associate = (models) => {
    Rating.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
    Rating.belongsTo(models.Offer, { foreignKey: 'offerId', targetKey: 'id' });
  };
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

  return Rating;
};
