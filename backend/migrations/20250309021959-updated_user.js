'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        shop_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        google_id: {
            type: Sequelize.STRING
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        completed_registration: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        roles: {
            type: Sequelize.JSON,
            allowNull: false,
            defaultValue: [3]
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });
},

down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
}
};
