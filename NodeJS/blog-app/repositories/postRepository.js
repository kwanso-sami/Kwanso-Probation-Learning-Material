const { Post, User, Category, Sequelize } = require("../models");
const { Op, literal } = Sequelize;
const { APIError, STATUS_CODES } = require("../utils/appError");

class PostRepository {
  constructor() {
    this.Model = Post;
  }

  async GetAllPosts(offset, limit, sortBy, orderBy, searchBy, userId) {
    try {
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

      const { count, rows } = await this.Model.findAndCountAll({
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

      return { count, rows };
    } catch (err) {
      console.log(err.message);
      throw new APIError(
        "Unable to Get All Posts",
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  }
}

module.exports = PostRepository;
