// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")


// Route to build vehicle by vehicledetails view
router.get("/detail/:classificationId", invController.BuildByVehicleId);

module.exports = router;