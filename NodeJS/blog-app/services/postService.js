const { APIError } = require("../utils/appError");
const logger = require("../utils/loggers/appLogger");
const { Post, User, Category, Sequelize } = require("../models");
const { Op } = Sequelize;
const { STATUS_CODE, ERROR_TYPE,ERROR_MESSAGE } = require("../utils/constants");

class PostService {
  constructor() {
    this.PostModel = Post;
    this.UserModel = User;
    this.CategoryModel = Category;
  }

  async GetAllPosts(postParams) {
    try {
      const { page, perPage, sortBy, orderBy, searchBy, userId } = postParams;

      const offset = (page - 1) * perPage;
      const limit = perPage;
      const postFilter = {};

      if (userId) {
        const user = await this.UserModel.findByPk(userId);
        if (!user) {
          throw new APIError(
            ERROR_MESSAGE.USER_NOT_FOUND,
            STATUS_CODE.NOT_FOUND,
            ERROR_TYPE.API_ERROR
          );
        }

        postFilter.userId = userId;
      }

      if (searchBy) {
        postFilter[Op.or] = [
          { title: { [Op.like]: `%${searchBy}%` } },
          { "$category.name$": { [Op.like]: `%${searchBy}%` } },
        ];
      }

      const userInclude = {
        model: this.UserModel,
        as: "creator",
        attributes: ["id", "firstName", "lastName", "profileThumbnail"],
      };

      const categoryInclude = {
        model: this.CategoryModel,
        as: "category",
        attributes: ["id", "name"],
      };

      const {
        count: totalCount,
        rows: data,
      } = await this.PostModel.findAndCountAll({
        where: postFilter,
        offset: offset,
        limit: limit,
        order: [[sortBy, orderBy]],
        attributes: {
          exclude: ["coverImage", "userId", "categoryId"],
        },
        include: [userInclude, categoryInclude],
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

  async GetPost(postId) {
    try {
      const userInclude = {
        model: this.UserModel,
        as: "creator",
        attributes: ["id", "firstName", "lastName", "profileThumbnail"],
      };

      const categoryInclude = {
        model: this.CategoryModel,
        as: "category",
        attributes: ["id", "name"],
      };

      const post = await this.PostModel.findOne({
        where: { id: postId },
        attributes: {
          exclude: ["coverThumbnail", "userId", "categoryId"],
        },
        include: [userInclude, categoryInclude],
      });

      if (!post) {
        throw new APIError(
          ERROR_MESSAGE.POST_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }

      return post;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async CreatePost(newPost) {
    try {
      const post = await this.PostModel.create(newPost);
      return post;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async UpdatePost(updateFields, postId) {
    try {
      const post = await this.PostModel.findByPk(postId);
      if (!post) {
        throw new APIError(
          ERROR_MESSAGE.POST_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }
      const updatedPost = await post.update(updateFields);
      return updatedPost;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async DeletePost(postId) {
    try {
      const post = await this.PostModel.findByPk(postId);
      if (!post) {
        throw new APIError(
          ERROR_MESSAGE.POST_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }
      await post.destroy();
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async GetAllCategories() {
    try {
      const categories = await this.CategoryModel.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return categories;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }
}

module.exports = PostService;
