'use strict';
const {
  Model
} = require('sequelize');

const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Salt extends Model {

    static associate(models) {
      Salt.belongsTo(models.User, { foreignKey: 'userID' });
    }
  }
  Salt.init({

    userID: {
      type: DataTypes.UUID,
      references: {
        model: 'users', 
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull:false
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
      primaryKey: true,
      allowNull:false
    },
    salt: {
      type: DataTypes.STRING,
    }
    
  }, {
    sequelize,
    modelName: 'Salt',
    tableName: "salts",
    timestamps: false,
  });
  return Salt;
};











'use strict';
// const { v4: uuidv4 } = require('uuid');

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('salts', {
//       id: {
//         type: Sequelize.UUID,
//         defaultValue: uuidv4(),
//         primaryKey: true,
//         allowNull: false,
//       },
//       userID: {
//         type: Sequelize.UUID,
//         references: {
//           model: 'users', 
//           key: 'id'      
//         },
//         onDelete: 'CASCADE',
//         allowNull: false,
//       },
//       salt: {
//         type: Sequelize.STRING,
//         allowNull: true,
//       },
//       createdAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
//       },
//       updatedAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
//       },
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('salts');
//   },
// };




