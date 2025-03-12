'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'roles', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: [3]
    });
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'roles');
  }
};
