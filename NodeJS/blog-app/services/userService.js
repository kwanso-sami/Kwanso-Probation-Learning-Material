const UserRepository = require("../repositories/userRepository");
const PostRepository = require("../repositories/postRepository");
const { APIError, STATUS_CODES } = require("../utils/appError");

class UserService {
  constructor() {
    this.UserRepository = new UserRepository();
    this.PostRepository = new PostRepository();
  }

  async FindUser(userID) {
    try {
      const user = await this.UserRepository.FindUserById(userID);
      if (!user) {
        throw new APIError("User Not Found", STATUS_CODES.NOT_FOUND);
      }
      return user;
    } catch (err) {
      throw new APIError(`USERS API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async UpdateUser(user) {
    try {
      const { name, userId } = user;
      const updatedUser = await this.UserRepository.UpdateUser(
        { name },
        userId
      );
      return updatedUser;
    } catch (err) {
      throw new APIError(`USERS API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async getAllPostsOfUser(postParams) {
    try {
      const { page, perPage, sortBy, orderBy, searchBy, userId } = postParams;

      const offset = (page - 1) * perPage;
      const limit = perPage;

      const {
        count: totalCount,
        rows: data,
      } = await this.PostRepository.GetAllPosts(
        offset,
        limit,
        sortBy,
        orderBy,
        searchBy,
        userId
      );

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
