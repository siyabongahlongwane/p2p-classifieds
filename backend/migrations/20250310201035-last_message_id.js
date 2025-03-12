'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('chats', 'last_message_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'messages', // References the messages table
        key: 'message_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('chats', 'last_message_id');
  }
};
