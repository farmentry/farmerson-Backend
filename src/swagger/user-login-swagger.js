const express = require("express");
const {
  loginUserController,
} = require("../controller/user-authentication-controller");

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user using email and password with Supabase. Checks if the user has an address entry in the database.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 addressExists:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized (Invalid email or password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: "Invalid login credentials"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/login", loginUserController);

module.exports = router;
