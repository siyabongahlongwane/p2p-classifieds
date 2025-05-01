'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'gender', {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: 'Unisex'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'gender', {
      type: Sequelize.STRING(30),
      allowNull: false, // rollback to NOT NULL if needed
    });
  }
};
