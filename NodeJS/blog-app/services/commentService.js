const { APIError } = require("../utils/appError");
const logger = require("../utils/loggers/appLogger");
const { Comment, User, Sequelize } = require("../models");
const { Op } = Sequelize;
const {
  STATUS_CODE,
  ERROR_TYPE,
  ERROR_MESSAGE,
} = require("../utils/constants");

class CommentService {
  constructor() {
    this.CommentModel = Comment;
    this.UserModel = User;
  }

  async CreateComment(newComment) {
    try {
      const comment = await this.CommentModel.create(newComment);
      return comment;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async GetAllComments(commentParams) {
    try {
      const { page, perPage, sortBy, orderBy, postId, withReplies } = commentParams;

      const offset = (page - 1) * perPage;
      const limit = perPage;

      const commentFilter = {
        parentCommentId: {
          [Op.is]: null,
        },
      };

      if (postId) {
        commentFilter.postId = postId;
      }

      const userInclude = {
        model: this.UserModel,
        as: "creator",
        attributes: ["id", "firstName", "lastName", "profileThumbnail"],
      };

      const replyInclude = {
        model: this.CommentModel,
        as: "replies",
        attributes: [["id", "replyId"], "body", "createdAt", "updatedAt"],
        include: [
          {
            model: this.UserModel,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profileThumbnail"],
          },
        ],
      };

      const includeModels = [userInclude];
      const orderByQuery = [[sortBy, orderBy]];

      if (withReplies) {
        includeModels.push(replyInclude);
        orderByQuery.push([
          this.CommentModel.associations.replies,
          sortBy,
          orderBy,
        ]);
      }

      const {
        count: totalCount,
        rows: data,
      } = await this.CommentModel.findAndCountAll({
        where: commentFilter,
        offset: offset,
        limit: limit,
        order: orderByQuery,
        attributes: [["id", "commentId"], "body", "createdAt", "updatedAt"],
        include: includeModels,
      });

      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = Math.ceil(offset / limit) + 1;

      return {
        data,
        metaData: {
          totalCount,
          totalPages: totalPages,
          currentPage: currentPage,
        },
      };
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async DeleteComment(commentId) {
    try {
      const comment = await this.CommentModel.findByPk(commentId);
      if (!comment) {
        throw new APIError(
          ERROR_MESSAGE.COMMENT_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }

      await comment.destroy();
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async UpdateComment(updateFields, commentId) {
    try {
      const comment = await this.CommentModel.findByPk(commentId);
      if (!comment) {
        throw new APIError(
          ERROR_MESSAGE.COMMENT_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }

      const updatedComment = await comment.update(updateFields);
      return updatedComment;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async GetCommentReplies(commentId, replyParams) {
    try {
      const comment = await this.CommentModel.findByPk(commentId);
      if (!comment) {
        throw new APIError(
          ERROR_MESSAGE.COMMENT_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }

      const { sortBy, orderBy } = replyParams;

      const userInclude = {
        model: this.UserModel,
        as: "creator",
        attributes: ["id", "firstName", "lastName", "profileThumbnail"],
      };

      const replies = await this.CommentModel.findAll({
        where: {
          parentCommentId: commentId,
        },
        order: [[sortBy, orderBy]],
        attributes: [["id", "replyId"], "body", "createdAt", "updatedAt"],
        include: [userInclude],
      });

      if (replies.length === 0) {
        throw new APIError(
          ERROR_MESSAGE.REPLIES_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }
      return replies;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }
}

module.exports = CommentService;
