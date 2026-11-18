const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

<<<<<<< HEAD
const configPath = path.join(__dirname, '..', 'config', 'postgresConfig.json');

const config = { ...require(configPath)[env] };
config.username = process.env.DB_USER || config.username;
config.password = process.env.DB_PASSWORD || config.password;
config.database = process.env.DB_NAME || config.database;
config.host = process.env.DB_HOST || config.host;
if (
  env === 'production' &&
  ['DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST'].some((key) => !process.env[key])
) {
  throw new Error('DB_USER, DB_PASSWORD, DB_NAME and DB_HOST must be set in production');
}
=======
const configPath = env === 'production'
  ? path.join(__dirname, '..', '..', '..', 'src/server/config/postgresConfig.json')
  : path.join(__dirname, '..', '/config/postgresConfig.json');

const config = require(configPath)[env];
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associations
db.Contests.belongsTo(db.Users, { foreignKey: 'userId', sourceKey: 'id' });
db.Contests.hasMany(db.Offers, { foreignKey: 'contestId', targetKey: 'id' });

db.Users.hasMany(db.Offers, { foreignKey: 'userId', targetKey: 'id' });
db.Users.hasMany(db.Contests, { foreignKey: 'userId', targetKey: 'id' });
db.Users.hasMany(db.Ratings, { foreignKey: 'userId', targetKey: 'id' });

db.Offers.belongsTo(db.Users, { foreignKey: 'userId', sourceKey: 'id' });
db.Offers.belongsTo(db.Contests, { foreignKey: 'contestId', sourceKey: 'id' });
db.Offers.hasOne(db.Ratings, { foreignKey: 'offerId', targetKey: 'id' });

db.Ratings.belongsTo(db.Users, { foreignKey: 'userId', targetKey: 'id' });
db.Ratings.belongsTo(db.Offers, { foreignKey: 'offerId', targetKey: 'id' });

<<<<<<< HEAD
// --- Chat associations ---
// Раньше связи чата объявлялись внутри model.associate(), но associate()
// никогда не вызывался, из-за чего db.Conversations не знал о Users/Messages
// и любой запрос чата падал с 500.
db.Conversations.hasMany(db.Messages, { foreignKey: 'conversationId' });
db.Messages.belongsTo(db.Conversations, { foreignKey: 'conversationId' });

db.Users.hasMany(db.Messages, { foreignKey: 'sender' });
db.Messages.belongsTo(db.Users, { foreignKey: 'sender' });

db.Conversations.belongsToMany(db.Users, {
  through: db.ConversationParticipant,
  foreignKey: 'conversationId',
  otherKey: 'userId',
});
db.Users.belongsToMany(db.Conversations, {
  through: db.ConversationParticipant,
  foreignKey: 'userId',
  otherKey: 'conversationId',
});

db.Users.hasMany(db.Catalogs, { foreignKey: 'userId' });
db.Catalogs.belongsTo(db.Users, { foreignKey: 'userId' });

db.Catalogs.belongsToMany(db.Conversations, {
  through: db.CatalogsToConversations,
  foreignKey: 'catalogId',
  otherKey: 'conversationId',
  as: 'chats',
});
db.Conversations.belongsToMany(db.Catalogs, {
  through: db.CatalogsToConversations,
  foreignKey: 'conversationId',
  otherKey: 'catalogId',
});

=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
