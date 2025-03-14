const express = require("express");
const router = express.Router();
const addPlantationController = require("../controllers/addPlantationController");

/**
 * @swagger
 * auth/horticulture/add-plantation:
 *   post:
 *     summary: Add horticulture crop details
 *     description: Adds a new horticulture crop record with all required details.
 *     tags:
 *       - Horticulture Crops
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - cropName
 *               - variety
 *               - plantingDate
 *               - expectedYield
 *               - growthStage
 *               - plantationArea
 *               - cultivationType
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *               cropName:
 *                 type: string
 *                 example: "Tomato"
 *               variety:
 *                 type: string
 *                 example: "Hybrid"
 *               plantingDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-01"
 *               expectedYield:
 *                 type: number
 *                 example: 100.5
 *               growthStage:
 *                 type: string
 *                 enum: [Seedling, Vegetative, Flowering, Maturity, Harvest]
 *                 example: "Flowering"
 *               plantationArea:
 *                 type: number
 *                 example: 5.5
 *               cultivationType:
 *                 type: string
 *                 enum: [Open Field, Greenhouse, Polyhouse]
 *                 example: "Greenhouse"
 *               pesticidesUsed:
 *                 type: string
 *                 example: "Neem Oil, Bio-pesticides"
 *               fertilizersUsed:
 *                 type: string
 *                 example: "Urea, NPK Fertilizer"
 *     responses:
 *       200:
 *         description: Successfully added horticulture crop details
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
 *                   example: "Horticulture crop details added successfully"
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/add-plantation", addPlantationController);

module.exports = router;
