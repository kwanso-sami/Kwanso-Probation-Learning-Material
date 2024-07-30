"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.hasMany(models.Comment, { foreignKey: "postId" });

      Post.belongsTo(models.User, {
        foreignKey: "userId",
        as: "creator",
      });
      Post.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
    }
  }

  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      readDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      coverImage: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      coverThumbnail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
    }
  );
  return Post;
};
