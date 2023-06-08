// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')
const utilities = require("../utilities")


// Route to build inventory by classification view.
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by ID view.
router.get("/detail/:vehicleId", invController.BuildByVehicleId);


/* ***********************
 * Unit 4 Deliver Management View
 * Assignment 4
 *************************/
router.get("/", invController.BuildManagement);


/* ***********************
 * Unit 4 Deliver Add-Classification View
 * Assignment 4
 *************************/
router.get("/add-classification", (invController.BuildAddClassification))


/* ***********************
 * Unit 4 Add the new Classification
 * Assignment 4
 * Process the add classification data
 *************************/
router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.AddClassification)
  )



module.exports = router;