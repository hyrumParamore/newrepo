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

    // const account_id = parseInt(res.locals.accountData.account_id)
    // const messageData = await accountModel.getMessagesByAccountId(account_id)
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






// validate.checkReplyMessageData = async (req, res, next) => {
//     const { message_from, message_to, message_subject, message_body } = req.body
//     const messageFromData = await accountModel.getAccountById(message_from)
//     const account_email = messageFromData.account_email

//     // const account_id = parseInt(res.locals.accountData.account_id)
//     // const messageData = await accountModel.getMessagesByAccountId(account_id)
//     // const recipientList = await utilities.getRecipient()

//     let errors = []
//     errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       let nav = await utilities.getNav()
//       res.render("account/replyMessage", {
//         errors,
//         title: `New Message`,
//         nav,
//         message_to,
//         message_subject,
//         message_body,
//         account_email,
//       })
//       return
//     }
//     next()
// }

/*  **********************************
 *  Check data and return errors or continue to sending the message
 * ********************************* */
validate.checkReplyMessageData = async (req, res, next) => {
    const { 
      // message_subject, 
      // message_body, 
      message_to, 
      message_id,

    } = req.body

    console.log("This is the subject")
    // console.log(message_subject)
    console.log("This is the id")
    console.log(message_id)
    console.log("This is the body")
    // console.log(message_body)

    

    const messageFromData = await accountModel.getAccountById(message_to)
    const accountFromId = messageFromData.account_id
    const account_email = messageFromData.account_email

    const messageFromId = await messageModel.getMessageByMessageId(message_id)
    const message_subject = messageFromId.message_subject
    const message_body = messageFromId.message_body

    console.log(message_subject)
    

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("messages/replyMessage", {
        errors,
        title: `Reply to ${messageFromData.account_firstname} ${messageFromData.account_lastname} `,
        nav,
        message_subject,
        message_body,
        message_id,
        account_email,
        accountFromId,
      })
      return
    }
    next()
}


// validate.checkUpdateData = async (req, res, next) => {
//   const {
//     inv_id,
//     inv_make,
//     inv_model,
//     inv_year,
//     inv_description,
//     inv_image,
//     inv_thumbnail,
//     inv_price,
//     inv_miles,
//     inv_color,
//     classification_id,

//   } = req.body

//   let errors = []
//   errors = validationResult(req)
//   if (!errors.isEmpty()) {
//     let nav = await utilities.getNav()
//     let selectList = await utilities.getClassifications(classification_id)
//     res.render("./inventory/edit-inventory", {
//       errors,
//       title: "Edit Inventory",
//       nav,
//       selectList,
//       inv_id,
//       inv_make,
//       inv_model,
//       inv_year,
//       inv_description,
//       inv_image,
//       inv_thumbnail,
//       inv_price,
//       inv_miles,
//       inv_color,
//       classification_id,
//     })
//     return
//   }
//   next()
// }






module.exports = validate