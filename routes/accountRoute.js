/* ***********************
 * Account routes
 * Unit 4 deliver login view activity
 *************************/
// Needed Resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const messageController = require("../controllers/messageController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const messageValidate = require('../utilities/message-validation')
const validate = require("../utilities/account-validation")


/* ***********************
 * Deliver Login view
 * Unit 4 deliver login view activity
 *************************/
router.get(
  "/login", 
  utilities.handleErrors(accountController.buildLogin)
);


/* ***********************
 * Deliver Registration view
 * Unit 4 deliver registration view activity
 *************************/
// Route to build login view
router.get(
  "/register", 
  utilities.handleErrors(accountController.buildRegister)
)


/* ***********************
 * Deliver account view
 * Unit 5 - JWT Authorization activity
 *************************/
router.get(
  "/",  
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)


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
 * Updated in Unit 5 - Process the login data
 *************************/
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ***********************
 * Update Account Data
 * Unit 5 Task 4
 *************************/
router.get(
  "/editAccount",
  utilities.checkLogin,
  utilities.handleErrors(accountController.editAccountView)
)

/* ***********************
 * Update Account Data
 * Unit 5 Task 4
 *************************/
router.post(
  "/update/", 
  regValidate.accountUpdateRules(),
  regValidate.checkAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

/* ***********************
 * Update Password Data
 * Unit 5 Task 4
 *************************/
router.post(
  "/update/password", 
  regValidate.passwordRules(),
  regValidate.checkAccountData,
  utilities.handleErrors(accountController.updatePassword)
)


/* ***********************
 * Logout account
 * Unit 5 Task 6
 *************************/
router.get(
  "/logout",
  utilities.handleErrors(accountController.logoutAccount)
)


module.exports = router;