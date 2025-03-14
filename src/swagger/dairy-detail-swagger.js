const express = require("express");
const { createDailyController } = require("../controller/dairy-controller");

const router = express.Router();

/**
 * @swagger
 * /dairy/create:
 *   post:
 *     summary: Create a new cattle record
 *     description: Adds cattle details to the database.
 *     tags:
 *       - Dairy Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cattleType
 *               - breed
 *               - milkProduction
 *               - feedingType
 *             properties:
 *               cattleType:
 *                 type: string
 *                 enum: ["Cow", "Buffalo", "Goat", "Sheep"]
 *                 example: "Cow"
 *               breed:
 *                 type: string
 *                 example: "Jersey"
 *               milkProduction:
 *                 type: number
 *                 minimum: 0
 *                 example: 10
 *               feedingType:
 *                 type: string
 *                 enum: ["Grazing", "Stall-fed", "Mixed"]
 *                 example: "Mixed"
 *     responses:
 *       200:
 *         description: Cattle details saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Cattle details saved successfully"
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/create", createDailyController);

module.exports = router;
