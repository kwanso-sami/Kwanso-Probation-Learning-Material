const { APIError, STATUS_CODES } = require("../utils/appError");
const { Comment } = require("../models");

class CommentService {
  constructor() {
    this.CommentModel = Comment;
  }

  async CreateAComment(newComment) {
    try {
      await this.CommentModel.create(newComment);
    } catch (err) {
      throw new APIError(`COMMENTS API ERROR : ${err.message}`, err.statusCode);
    }
  }
}

module.exports = CommentService;
