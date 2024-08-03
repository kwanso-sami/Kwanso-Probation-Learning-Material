const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/commentController");
const authenticateUser = require("../middlewares/userAuth");

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment on a post.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - body
 *               - postId
 *             properties:
 *               body:
 *                 type: string
 *                 example: "This is a comment."
 *               postId:
 *                 type: uuid
 *                 example: 10712d11-6d9a-4018-9cde-3f8882c1c08b
 *               parentCommentId:
 *                 type: uuid
 *                 example: 10712d11-6d9a-4018-9cde-3f8882c1c08b
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authorization Error
 */
commentRouter
  .route("/")
  .post(authenticateUser, commentController.createComment);

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve all comments, optionally filtered by postId and other query parameters.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of comments per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           example: desc
 *         description: Sort order
 *       - in: query
 *         name: withReplies
 *         schema:
 *           type: boolean
 *           example: false
 *         description: Include replies in the response
 *       - in: query
 *         name: postId
 *         schema:
 *           type: uuid
 *           example: 10712d11-6d9a-4018-9cde-3f8882c1c08b
 *         description: Filter comments by post ID
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Post Comments Not Found
 */
commentRouter.route("/").get(commentController.getAllComments);

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: uuid
 *           example: 10712d11-6d9a-4018-9cde-3f8882c1c08b
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment Not Found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authorization Error
 */
commentRouter
  .route("/:commentId")
  .delete(authenticateUser, commentController.deleteComment);

/**
 * @swagger
 * /comments/{commentId}:
 *   patch:
 *     summary: Update a comment
 *     description: Update a comment by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: uuid
 *           example: 10712d11-6d9a-4018-9cde-3f8882c1c08b
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 example: "Updated comment text."
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Comment Not Found
 *       401:
 *         description: Authorization Error
 */
commentRouter
  .route("/:commentId")
  .patch(authenticateUser, commentController.updateComment);

/**
 * @swagger
 * /comments/{commentId}/replies:
 *   get:
 *     summary: Get replies of a comment
 *     description: Retrieve replies of a specific comment.
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: uuid
 *           example: 10712d11-6d9a-4018-9cde-3f8882c1c08b
 *         description: ID of the comment to get replies for
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           example: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Replies fetched successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Comment Replies Not Found
 */
commentRouter
  .route("/:commentId/replies")
  .get(commentController.getCommentReplies);

module.exports = commentRouter;
