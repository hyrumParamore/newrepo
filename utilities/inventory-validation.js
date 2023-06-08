const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
  
      // password is required and must be strong password
      body("add_classification")
        .trim()
        .isLength({ min: 4 })
        .withMessage("Please enter a valid classification name")
        .custom(async (add_classification) => {
            const classificationExists = await invModel.CheckExistingClassification(add_classification)
            if (classificationExists){
              throw new Error("Classification with that name already exists. Please try different name.")
            }
          }),
    ]
  }


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { add_classification } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        add_classification,
      })
      return
    }
    next()
}



module.exports = validate