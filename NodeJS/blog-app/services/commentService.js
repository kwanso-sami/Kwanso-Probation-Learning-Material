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
      const { parentCommentId } = newComment;

      if (parentCommentId) {
        const parentComment = await this.CommentModel.findByPk(parentCommentId);
        
        if (!parentComment) {
          throw new APIError(
            `Parent Comment Not Found`,
            STATUS_CODE.NOT_FOUND,
            ERROR.API_ERROR
          );
        }
      }

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

      const commentAttributes = ["id", "body", "createdAt"];

      const userAttributes = [
        "id",
        "firstName",
        "lastName",
        "profileThumbnail",
      ];

      const includeModels = [
        {
          model: this.UserModel,
          as: "creator",
          attributes: userAttributes,
        },
      ];

      if (withReply) {
        includeModels.push({
          model: this.CommentModel,
          as: "replies",
          attributes: commentAttributes,
          include: [
            {
              model: this.UserModel,
              as: "creator",
              attributes: userAttributes,
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
        attributes: commentAttributes,
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
}

module.exports = CommentService;
