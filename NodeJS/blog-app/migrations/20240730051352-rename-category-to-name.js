"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("categories", "category", "name");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("categories", "name", "category");
  },
};