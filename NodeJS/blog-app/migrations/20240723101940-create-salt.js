'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('salts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      userID: {
        type: Sequelize.UUID,
        references: {
          model: 'users', 
          key: 'id'      
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('salts');
  },
};




