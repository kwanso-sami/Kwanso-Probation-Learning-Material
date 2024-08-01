const { APIError } = require("../utils/appError");
const { Comment, User } = require("../models");
const { STATUS_CODE, ERROR } = require("../utils/constants");

class CommentService {
  constructor() {
    this.CommentModel = Comment;
    this.UserModel = User;
  }

  async CreateAComment(newComment) {
    try {
      const comment = await this.CommentModel.create(newComment);
      return comment;
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async GetAllComments(commentParams) {
    try {
      const {
        page,
        perPage,
        sortBy,
        orderBy,
        postId,
        withReply,
      } = commentParams;

      const offset = (page - 1) * perPage;
      const limit = perPage;
      const commentFilter = {
        parentCommentId: null,
      };

      if (postId) {
        commentFilter.postId = postId;
      }

      const includeModels = [
        {
          model: this.UserModel,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "profileThumbnail"],
        },
      ];

      if (withReply) {
        includeModels.push({
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
        });
      }

      const {
        count: totalCount,
        rows: data,
      } = await this.CommentModel.findAndCountAll({
        where: commentFilter,
        offset: offset,
        limit: limit,
        order: [[sortBy, orderBy]],
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
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async DeleteAComment(commentId) {
    try {
      const comment = await this.CommentModel.findByPk(commentId);
      if (!comment) {
        throw new APIError(
          "Comment Not Found.",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }

      await comment.destroy();
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async UpdateAComment(updateFields, commentId) {
    try {
      const comment = await this.CommentModel.findByPk(commentId);
      if (!comment) {
        throw new APIError(
          "Comment Not Found.",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }

      const updatedComment = await comment.update(updateFields);
      return updatedComment;
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async GetRepliesForComment(commentId, replyParams) {
    try {
      const comment = await this.CommentModel.findByPk(commentId);
      if (!comment) {
        throw new APIError(
          "Comment Not Found.",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }

      const { sortBy, orderBy } = replyParams;
      const replies = await this.CommentModel.findAll({
        where: {
          parentCommentId: commentId,
        },
        order: [[sortBy, orderBy]],
        attributes: [["id", "replyId"], "body", "createdAt", "updatedAt"],
        include: [
          {
            model: this.UserModel,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "profileThumbnail"],
          },
        ],
      });

      if (replies.length === 0) {
        throw new APIError(
          "No replies found.",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }
      return replies;
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }
}

module.exports = CommentService;
