const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
 *  Final Project - Messaging System
 *  New Message Data Rules
 * ********************************* */
validate.messagingRules = () => {
    return [
  
      // message subject is required and must be string
      body("message_subject")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a message subject."), // on error this message is sent.
  
      // valid body is required
      body("message_body")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a message body."),
        
  
    ]
}



/*  **********************************
 *  Check data and return errors or continue to sending the message
 * ********************************* */
validate.checkMessageData = async (req, res, next) => {
    const { message_to, message_subject, message_body } = req.body
    const recipientList = await utilities.getRecipient()

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("messages/newMessage", {
        errors,
        title: `New Message`,
        nav,
        message_to,
        message_subject,
        message_body,
        recipientList,
      })
      return
    }
    next()
}


/*  **********************************
 *  Check data and return errors or continue to sending the message
 * ********************************* */
validate.checkReplyMessageData = async (req, res, next) => {
    const { 
      message_subject, 
      message_body, 
      message_to, 
      message_id,
    } = req.body

    const messageReplyData = await messageModel.getMessageByMessageId(message_id)
    let date = new Date(messageReplyData.message_created)
    let formattedDate = date.toLocaleDateString()
    let formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    let message_created = formattedDate + " Time: " + formattedTime

    const messageFromData = await accountModel.getAccountById(message_to)
    const accountFromId = messageFromData.account_id
    const account_email = messageFromData.account_email
    const reply_subject = messageReplyData.message_subject
    const reply_body = messageReplyData.message_body    

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("messages/replyMessage", {
        errors,
        title: `Reply to ${messageFromData.account_firstname} ${messageFromData.account_lastname} `,
        nav,
        reply_body,
        message_id,
        account_email,
        accountFromId,
        message_created,
      })
      return
    }
    next()
}




module.exports = validate