const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/postController");
const authenticateUser = require("../middlewares/userAuth");

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve all posts with optional query parameters for pagination and sorting.
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
 *         description: Number of posts per page
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
 *         name: searchBy
 *         schema:
 *           type: string
 *           example: "keyword"
 *         description: Keyword to search for title or category of posts
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Posts Not found
 */
postRouter.route("/").get(postController.getAllPosts);

/**
 * @swagger
 * /posts/user/{userId}:
 *   get:
 *     summary: Get posts by user
 *     description: Retrieve posts created by a specific user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: uuid
 *           example: df980b2a-2c8a-4602-a6e4-34a7346b051d
 *         description: ID of the user to fetch posts for
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
 *         description: Number of posts per page
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
 *         name: searchBy
 *         schema:
 *           type: string
 *           example: "keyword"
 *         description: Keyword to search for title or category of posts
 *     responses:
 *       200:
 *         description: User posts fetched successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authorization Error
 *       404: 
 *         description: User Posts Not Found
 */
postRouter
  .route("/user/:userId")
  .get(authenticateUser, postController.getUserPosts);

/**
 * @swagger
 * /posts/categories:
 *   get:
 *     summary: Get all post categories
 *     description: Retrieve all post categories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post categories fetched successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Post Categories Not Found
 *       401:
 *         description: Authorization Error
 */
postRouter
  .route("/categories")
  .get(authenticateUser, postController.getAllCategories);

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get a single post
 *     description: Retrieve a specific post by its ID.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: uuid
 *           example: d131a695-03cf-4276-aebe-b60bad065866
 *         description: ID of the post to fetch
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Post Not Found
 */
postRouter.route("/:postId").get(postController.getPost);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with the given data.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - categoryId
 *               - readDuration
 *               - coverImage
 *               - coverThumbnail
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Post Title"
 *               body:
 *                 type: string
 *                 example: "This is the content of the new post."
 *               categoryId:
 *                 type: uuid
 *                 example: ebdc8740-00e9-4b96-89e5-9b5383590059
 *               readDuration:
 *                 type: integer
 *                 example: 5
 *               coverImage:
 *                 type: string
 *                 example: "base 64 image"
 *               coverThumbnail:
 *                 type: string
 *                 example: "base64 image"
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authorization Error
 */
postRouter.route("/").post(authenticateUser, postController.createPost);

/**
 * @swagger
 * /posts/{postId}:
 *   patch:
 *     summary: Update a post
 *     description: Update an existing post by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: uuid
 *           example: d131a695-03cf-4276-aebe-b60bad065866
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Post Title"
 *               body:
 *                 type: string
 *                 example: "This is the updated content of the post."
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               readDuration:
 *                 type: integer
 *                 example: 5
 *               coverImage:
 *                 type: string
 *                 example: "base64 image"
 *               coverThumbnail:
 *                 type: string
 *                 example: "base64 image"
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authorization Error
 *       404:
 *         description: Post Not Found
 */
postRouter.route("/:postId").patch(authenticateUser, postController.updatePost);

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: uuid
 *           example: d131a695-03cf-4276-aebe-b60bad065866
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authorization Error
 *       404:
 *         description: Post Not Found
 */
postRouter
  .route("/:postId")
  .delete(authenticateUser, postController.deletePost);

module.exports = postRouter;
