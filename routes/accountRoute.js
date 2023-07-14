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





/* ***********************
 * Inbox View
 * Final Project - Messages
 *************************/
// router.get(
//   "/inbox",
//   utilities.checkLogin,
//   utilities.handleErrors(messageController.buildInboxView)
// )



// /* ***********************
//  * Archived Messages View
//  * Final Project - Messages
//  *************************/
// router.get(
//   "/archivedMessages",
//   utilities.checkLogin,
//   utilities.handleErrors(accountController.buildArchivedMessagesView)
// )


// /* ***********************
//  * New Messages View
//  * Final Project - Messages
//  *************************/
// router.get(
//   "/newMessage",
//   utilities.checkLogin,
//   utilities.handleErrors(accountController.buildCreateNewMessageView)
// )

// /* ***********************
//  * Post a new message and deliver view
//  * Final Project - Messages
//  *************************/
// router.post(
//   "/newMessage",
//   messageValidate.messagingRules(),
//   messageValidate.checkMessageData,
//   utilities.handleErrors(accountController.sendNewMessage)
// )


// /* ***********************
//  * Deliver a message view by Message ID
//  * Final Project - Messages
//  *************************/
// router.get(
//   "/inbox/:messageId",
//   utilities.checkLogin,
//   utilities.handleErrors(accountController.buildMessageByIdView)
// )




// /* *************************************************

// /* ***********************
//  * Reply to a message
//  * Final Project - Messages
//  *************************/
// router.get(
//   "/replyMessage/:messageId",
//   utilities.checkLogin,
//   utilities.handleErrors(accountController.buildReplyMessageView)
// )
// router.post(
//   "/replyMessage",
//   messageValidate.messagingRules(),
//   messageValidate.checkReplyMessageData,
//   utilities.handleErrors(accountController.replyToMessage)
// )

// // router.post(
// //   "/newMessage/:messageFrom",
// //   utilities.handleErrors(accountController.sendNewMessage)
// // )

// /* *************************************************


// /* ***********************
//  * Mark a Message as Read
//  * Final Project - Messages
//  *************************/
// router.post(
//   "/inbox/markAsRead/:messageId",
//   utilities.handleErrors(accountController.markAsRead)
// )

// /* ***********************
//  * Archive a message
//  * Final Project - Messages
//  *************************/
// router.post(
//   "/inbox/archive/:messageId",
//   utilities.handleErrors(accountController.archiveMessage)
// )

// /* ***********************
//  * Delete a message
//  * Final Project - Messages
//  *************************/
// router.post(
//   "/inbox/delete/:messageId",
//   utilities.handleErrors(accountController.deleteMessage)
// )



// /* ***********************
//  * Get inventory for AJAX Route
//  * Unit 5 Select inv item activity
//  *************************/
// // router.get(
// //   "/getInventory/:classification_id",
// //   regValidate.checkAccountAccess,
// //   utilities.handleErrors(accountController.getMessageData)
// // )



module.exports = router;