const express = require("express");
const { createCropDetailsModel } = require("../model/crop-managament.model");

const router = express.Router();

/**
 * @swagger
 * /crop-management/create:
 *   post:
 *     summary: Create a new crop entry
 *     description: Adds crop details to the database.
 *     tags:
 *       - Crops
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
 *               - estimatedHarvestDate
 *               - cultivationMethod
 *               - expectedYield
 *             properties:
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
 *               estimatedHarvestDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               cultivationMethod:
 *                 type: string
 *                 enum: ["Organic", "Conventional"]
 *                 example: "Organic"
 *               expectedYield:
 *                 type: number
 *                 example: 5000
 *               actualYield:
 *                 type: number
 *                 example: 4800
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
 */
router.post("/create`", createCropDetailsModel);

module.exports = router;
