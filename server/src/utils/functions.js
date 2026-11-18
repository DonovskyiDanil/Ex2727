const db = require('../models');
const CONSTANTS = require('../constants');

module.exports.createWhereForAllContests = (
  typeIndex, contestId, industry, awardSort) => {
  const object = {
    where: {},
    order: [],
  };
  if (typeIndex) {
    Object.assign(object.where, { contestType: getPredicateTypes(typeIndex) });
  }
  if (contestId) {
    Object.assign(object.where, { id: contestId });
  }
  if (industry) {
    Object.assign(object.where, { industry });
  }
  if (awardSort) {
    object.order.push(['prize', awardSort]);
  }
  Object.assign(object.where, {
    status: {
      [ db.Sequelize.Op.or ]: [
        CONSTANTS.CONTEST_STATUS_FINISHED,
        CONSTANTS.CONTEST_STATUS_ACTIVE,
      ],
    },
  });
  object.order.push(['id', 'desc']);
  return object;
};

function getPredicateTypes (index) {
<<<<<<< HEAD
  return { [ db.Sequelize.Op.in ]: types[ index ].split(',') };
=======
  return { [ db.Sequelize.Op.or ]: [types[ index ].split(',')] };
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
}

const types = [
  '',
  'name,tagline,logo',
  'name',
  'tagline',
  'logo',
  'name,tagline',
  'logo,tagline',
  'name,logo',
];
