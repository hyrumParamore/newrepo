// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/vehicleController")


// Route to build inventory by classification view
router.get("/detail/:classificationId", invController.buildByVehicleId);

module.exports = router;