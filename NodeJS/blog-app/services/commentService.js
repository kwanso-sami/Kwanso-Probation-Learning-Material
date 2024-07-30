const { APIError } = require("../utils/appError");
const { Comment, User, Sequelize } = require("../models");
const { literal } = Sequelize;

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
      throw new APIError(`COMMENTS API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async GetAllComments(commentParams) {
    try {
      const { page, perPage, sortBy, orderBy, postId, isReply } = commentParams;

      const offset = (page - 1) * perPage;
      const limit = perPage;
      const commentFilter = {};

      if (postId) {
        commentFilter.postId = postId;
      }

      const userAttributes = [
        "id",
        [literal('CONCAT("firstName", \' \', "lastName")'), "name"],
        "profileThumbnail",
      ];

      const commentAttributes = ["id", "body", "createdAt"];

      const includeModels = [
        {
          model: this.UserModel,
          as: "creator",
          attributes: userAttributes,
        },
      ];

      if (isReply) {
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
      throw new APIError(`COMMENTS API ERROR : ${err.message}`, err.statusCode);
    }
  }
}

module.exports = CommentService;
