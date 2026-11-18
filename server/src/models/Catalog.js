module.exports = (sequelize, DataTypes) => {
  const Catalog = sequelize.define('Catalogs', {
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
    catalogName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'catalogName', // Соответствие "catalogName" в SQL
    },
  }, {
    tableName: 'Catalogs', // Явное имя таблицы
    timestamps: false,
  });


  return Catalog;
};
