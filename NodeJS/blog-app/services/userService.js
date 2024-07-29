const { APIError, STATUS_CODES } = require("../utils/appError");
const { Post, User, Category, Sequelize } = require("../models");
const { Op, literal } = Sequelize;
const { APIError, STATUS_CODES } = require("../utils/appError");

class UserService {
  constructor() {
    this.UserModel = User;
    this.PostModel = Post;
  }

  async FindUser(id) {
    try {
      const user = await this.UserModel.findOne({
        where: { id },
      });
      if (!user) {
        throw new APIError("User Not Found", STATUS_CODES.NOT_FOUND);
      }
      return user;
    } catch (err) {
      throw new APIError(`USERS API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async UpdateUser(updateFields,userId) {
    try {
      const [updatedUser] = await this.UserModel.update(updateFields, {
        where: { id: userId },
        returning: true,
      });
      return updatedUser[0];
    } catch (err) {
      throw new APIError(`USERS API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async getAllPostsOfUser(postParams) {
    try {
      const { page, perPage, sortBy, orderBy, searchBy, userId } = postParams;

      const offset = (page - 1) * perPage;
      const limit = perPage;
      const postFilter = {};

      if (userId) {
        postFilter.userId = userId;
      }

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
      throw new APIError(`USERS API ERROR : ${err.message}`, err.statusCode);
    }
  }
}

module.exports = UserService;
