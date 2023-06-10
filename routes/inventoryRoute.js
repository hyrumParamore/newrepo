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
    utilities.handleErrors(invController.AddNewClassification)
)


/* ***********************
 * Unit 4 Deliver Add-Inventory View
 * Assignment 4
 *************************/
router.get("/add-inventory", (invController.BuildAddInventory))

/* ***********************
 * Unit 4 Add the new Inventory
 * Assignment 4
 * Process the add inventory data
 *************************/
router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,   // I don't think I need this for this route.
  utilities.handleErrors(invController.AddNewInventory)  // This builds the addInventory function to then process all the data.
)



module.exports = router;