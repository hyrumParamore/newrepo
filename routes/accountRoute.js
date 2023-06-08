/* ***********************
 * Account routes
 * Unit 4 deliver login view activity
 *************************/
// Needed Resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


/* ***********************
 * Deliver Login view
 * Unit 4 deliver login view activity
 *************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin));


/* ***********************
 * Deliver Registration view
 * Unit 4 deliver registration view activity
 *************************/
// Route to build login view
router.get("/register", utilities.handleErrors(accountController.buildRegister))


// Unit 4 
// Deliver Register Account
// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(), // Misspelling: registrationRules was spelt registationRules.
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)


/* ***********************
 * Unit 4 Deliver Login process
 * Process the login data
 *************************/
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  (req, res) => {
    res.status(200).send('login process')
  }
)





module.exports = router;