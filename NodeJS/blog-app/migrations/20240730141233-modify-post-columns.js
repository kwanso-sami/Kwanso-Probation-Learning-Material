"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("posts", "title", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.changeColumn("posts", "categoryId", {
      type: Sequelize.UUID,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("posts", "title", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });

    await queryInterface.changeColumn("posts", "categoryId", {
      type: Sequelize.UUID,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: null,
      allowNull: false,
    });
  },
};
