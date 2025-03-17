const express = require("express");
const {
  createCropDetails,
} = require("../controllers/crop-management.controller");

const router = express.Router();

/**
 * @swagger
 * /crop-management/create:
 *   post:
 *     summary: Create a new crop entry
 *     description: Adds crop details to the database.
 *     tags:
 *       - Agriculture
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cropName
 *               - cropVariety
 *               - sowingDate
 *               - expectedHarvestDate
 *               - currentGrowthStage
 *               - totalCultivatedArea
 *               - expectedYield
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "1"
 *               cropName:
 *                 type: string
 *                 example: "Wheat"
 *               cropVariety:
 *                 type: string
 *                 example: "Durum"
 *               sowingDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-01"
 *               expectedHarvestDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               currentGrowthStage:
 *                 type: string
 *                 enum: ["Seedling", "Vegetative", "Flowering", "Maturity", "Harvest"]
 *                 example: "Vegetative"
 *               totalCultivatedArea:
 *                 type: number
 *                 example: 10.5
 *               expectedYield:
 *                 type: number
 *                 example: 5000
 *               fertilizersUsed:
 *                 type: string
 *                 example: "Urea, DAP"
 *               pesticidesUsed:
 *                 type: string
 *                 example: "Neem Oil, Insecticide X"
 *               marketPricePerQuintal:
 *                 type: number
 *                 example: 2500
 *     responses:
 *       200:
 *         description: Crop details saved successfully
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
 *                   example: "Crop details saved successfully"
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post("/create", createCropDetails);

module.exports = router;
