const { APIError } = require("../utils/appError");
const { Post, User, Category, Sequelize } = require("../models");
const { Op } = Sequelize;
const { STATUS_CODE, ERROR } = require("../utils/constants");

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
            "User Not Found",
            STATUS_CODE.NOT_FOUND,
            ERROR.API_ERROR
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

      const includeModels = [
        {
          model: this.UserModel,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "profileThumbnail"],
        },
        {
          model: this.CategoryModel,
          as: "category",
          attributes: ["id", "name"],
        },
      ];

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

  async GetAPost(postId) {
    try {
      const includeModels = [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "profileThumbnail"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ];

      const post = await this.PostModel.findOne({
        where: { id: postId },
        attributes: {
          exclude: ["coverThumbnail", "userId", "categoryId"],
        },
        include: includeModels,
      });

      if (!post) {
        throw new APIError(
          "Post Not Found.",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }

      return post;
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async CreateAPost(newPost) {
    try {
      const post = await this.PostModel.create(newPost);
      return post;
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async UpdateAPost(updateFields, postId) {
    try {
      const post = await this.PostModel.findByPk(postId);
      if (!post) {
        throw new APIError(
          "Post Not Found.",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }
      const updatedPost = await post.update(updateFields);
      return updatedPost;
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async DeleteAPost(postId) {
    try {
      const post = await this.PostModel.findByPk(postId);
      if (!post) {
        throw new APIError(
          "Post Not Found.",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }
      await post.destroy();
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async GetAllCategories() {
    try {
      const categories = await this.CategoryModel.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return categories;
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }
}

module.exports = PostService;
