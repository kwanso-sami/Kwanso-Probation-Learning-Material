"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, { foreignKey: "postID" });

      Comment.belongsTo(models.Comment, {
        as: "Parent",
        foreignKey: "parentCommentId",
      });
      Comment.hasMany(models.Comment, {
        as: "Replies",
        foreignKey: "parentCommentId",
      });
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      postID: {
        type: DataTypes.UUID,
        references: {
          model: "posts",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },

      parentCommentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "comments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
      timestamps: true,
    }
  );
  return Comment;
};
