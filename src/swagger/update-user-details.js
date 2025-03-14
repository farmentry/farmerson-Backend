const express = require("express");
const router = express.Router();
const {
  updateUserDetailsController,
} = require("../controller/user-authentication-controller");

/**
 * @swagger
 * /auth/api/users:
 *   put:
 *     summary: Update user's Date of Birth (DOB)
 *     description: Updates the Date of Birth (DOB) of a user based on their email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1998-10-22"
 *     responses:
 *       200:
 *         description: User DOB updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "User DOB updated successfully"
 *                 data:
 *                   type: object
 *                   example: { "email": "user@example.com", "dob": "1998-10-22" }
 *       400:
 *         description: Bad request - Missing or invalid email/DOB parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Invalid email or DOB format"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: "User not found"
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
 *                   example: "Something went wrong"
 */

router.put("/users", updateUserDetailsController);

module.exports = router;
