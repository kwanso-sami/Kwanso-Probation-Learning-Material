'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('users', ['email'], {
      name: 'users_email_index',
      unique: true,
    });
    await queryInterface.addIndex('posts', ['title'], {
      name: 'posts_title_index',
      unique: true,
    });
    await queryInterface.addIndex('categories', ['name'], {
      name: 'categories_name_index',
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users', 'users_email_index');
    await queryInterface.removeIndex('posts', 'posts_title_index');
    await queryInterface.removeIndex('categories', 'categories_name_index');
  },
};
