'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if column 'conversation' exists before renaming
    const tableDesc = await queryInterface.describeTable('Messages');
    if (tableDesc.conversation && !tableDesc.conversationId) {
      await queryInterface.renameColumn('Messages', 'conversation', 'conversationId');
    }
  },

  async down (queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('Messages');
    if (tableDesc.conversationId && !tableDesc.conversation) {
      await queryInterface.renameColumn('Messages', 'conversationId', 'conversation');
    }
  }
};
