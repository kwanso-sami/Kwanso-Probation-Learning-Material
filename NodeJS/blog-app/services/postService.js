const { APIError, STATUS_CODES } = require("../utils/appError");
const { Post, User, Category, Sequelize } = require("../models");
const { Op, literal } = Sequelize;

class PostService {
  constructor() {
    this.PostModel = Post;
  }

  async GetAllPosts(postParams) {
    try {
      const { page, perPage, sortBy, orderBy, searchBy } = postParams;

      const offset = (page - 1) * perPage;
      const limit = perPage;

      const postFilter = {};

      if (searchBy) {
        postFilter[Op.or] = [
          { title: { [Op.like]: `%${searchBy}%` } },
          { "$category.category$": { [Op.like]: `%${searchBy}%` } },
        ];
      }

      const {
        count: totalCount,
        rows: data,
      } = await this.Model.findAndCountAll({
        where: postFilter,
        offset: offset,
        limit: limit,
        order: [[sortBy, orderBy]],
        attributes: {
          exclude: ["coverImage", "userId", "categoryId"],
        },
        include: [
          {
            model: User,
            as: "creator",
            attributes: [
              "id",
              [literal('CONCAT("firstName", \' \', "lastName")'), "name"],
              "profileThumbnail",
            ],
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", ["category", "name"]],
          },
        ],
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
      throw new APIError(
        `POSTS API ERROR : ${err.message}`,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  }

  async GetAPost({ postId: id }) {
    try {
      const post = await this.PostModel.findOne({
        where: { id },
        attributes: {
          exclude: ["coverThumbnail", "userId", "categoryId"],
        },
        include: [
          {
            model: User,
            as: "creator",
            attributes: [
              "id",
              [literal('CONCAT("firstName", \' \', "lastName")'), "name"],
              "profileThumbnail",
            ],
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", ["category", "name"]],
          },
        ],
      });

      return post;
    } catch (err) {
      throw new APIError(
        `POSTS API ERROR : ${err.message}`,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  }

  async CreteAPost(newPost) {
    try {
      const post = await this.PostModel.create(newPost);
      return post;
    } catch (err) {
      throw new APIError(
        `POSTS API ERROR : ${err.message}`,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  }
}

module.exports = PostService;
