<<<<<<< HEAD
const jwtSecret = process.env.JWT_SECRET || (
  process.env.NODE_ENV === 'production'
    ? ''
    : 'local-development-only-secret'
);

if (!jwtSecret) {
  throw new Error('JWT_SECRET must be set outside development');
}

module.exports = {
  JWT_SECRET: jwtSecret,
  ACCESS_TOKEN_TIME: 60 * 60,
  SALT_ROUNDS: 5,
  SQUADHELP_BANK_NUMBER: process.env.SQUADHELP_BANK_NUMBER || '4564654564564564',
  SQUADHELP_BANK_NAME: 'SquadHelp',
  SQUADHELP_BANK_CVC: process.env.SQUADHELP_BANK_CVC || '453',
  SQUADHELP_BANK_EXPIRY: process.env.SQUADHELP_BANK_EXPIRY || '11/29',
  CUSTOMER: 'customer',
  CREATOR: 'creator',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
=======
module.exports = {
  JWT_SECRET: 'asdasdasd4as5d4as8d7a8sd4as65d4a8sd7asd4as56d4',
  ACCESS_TOKEN_TIME: 60 * 60,
  SALT_ROUNDS: 5,
  SQUADHELP_BANK_NUMBER: '4564654564564564',
  SQUADHELP_BANK_NAME: 'SquadHelp',
  SQUADHELP_BANK_CVC: '453',
  SQUADHELP_BANK_EXPIRY: '11/26',
  CUSTOMER: 'customer',
  CREATOR: 'creator',
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  CREATOR_ENTRIES: 'creator_entries',
  CONTEST_STATUS_ACTIVE: 'active',
  CONTEST_STATUS_FINISHED: 'finished',
  CONTEST_STATUS_PENDING: 'pending',
  CONTESTS_DEFAULT_DIR: 'public/images/',
  NAME_CONTEST: 'name',
  LOGO_CONTEST: 'logo',
  TAGLINE_CONTEST: 'tagline',
  OFFER_STATUS_PENDING: 'pending',
  OFFER_STATUS_REJECTED: 'rejected',
  OFFER_STATUS_WON: 'won',
  OFFER_STATUS_APPROVED: 'approved',
  FILES_PATH: 'public/',
  SOCKET_CONNECTION: 'connection',
  SOCKET_SUBSCRIBE: 'subscribe',
  SOCKET_UNSUBSCRIBE: 'unsubscribe',
  NOTIFICATION_ENTRY_CREATED: 'onEntryCreated',
  NOTIFICATION_CHANGE_MARK: 'changeMark',
  NOTIFICATION_CHANGE_OFFER_STATUS: 'changeOfferStatus',
  NEW_MESSAGE: 'newMessage',
  CHANGE_BLOCK_STATUS: 'CHANGE_BLOCK_STATUS',
};
