/* ***********************
 * Message routes
 * Final Project - deliver message activity
 *************************/
// Needed Resources
const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const messageValidate = require('../utilities/message-validation')
const validate = require("../utilities/account-validation")



/* ***********************
 * Inbox View
 * Final Project - Messages
 *************************/
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildInboxView)
)


/* ***********************
 * Archived Messages View
 * Final Project - Messages
 *************************/
router.get(
  "/archivedMessages",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildArchivedMessagesView)
)


/* ***********************
 * New Messages View
 * Final Project - Messages
 *************************/
router.get(
  "/newMessage",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildCreateNewMessageView)
)

/* ***********************
 * Post a new message and deliver view
 * Final Project - Messages
 *************************/
router.post(
  "/newMessage",
  messageValidate.messagingRules(),
  messageValidate.checkMessageData,
  utilities.handleErrors(messageController.sendNewMessage)
)


/* ***********************
 * Deliver a message view by Message ID
 * Final Project - Messages
 *************************/
router.get(
  "/:messageId",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildMessageByIdView)
)

/* ***********************
 * Reply to a message
 * Final Project - Messages
 *************************/
router.get(
  "/replyMessage/:messageId",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildReplyMessageView)
)
router.post(
  "/replyMessage",
  utilities.checkLogin,
  messageValidate.messagingRules(),
  messageValidate.checkReplyMessageData,
  utilities.handleErrors(messageController.replyToMessage)
)


/* ***********************
 * Mark a Message as Read
 * Final Project - Messages
 *************************/
router.post(
  "/markAsRead/:messageId",
  utilities.checkLogin,
  utilities.handleErrors(messageController.markAsRead)
)

/* ***********************
 * Archive a message
 * Final Project - Messages
 *************************/
router.post(
  "/archive/:messageId",
  utilities.checkLogin,
  utilities.handleErrors(messageController.archiveMessage)
)

/* ***********************
 * Delete a message
 * Final Project - Messages
 *************************/
router.post(
  "/delete/:messageId",
  utilities.checkLogin,
  utilities.handleErrors(messageController.deleteMessage)
)


module.exports = router;