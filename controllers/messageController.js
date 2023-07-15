/* ***********************
 * Message Controller
 * Final Project
 *************************/
const messageModel = require("../models/message-model")
const accountModel = require("../models/account-model")
const utilities = require('../utilities')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


// ********************** Final Project *********************************


/* ***********************
 * Final Project
 * Build/Deliver Messages View
 *************************/
async function buildInboxView(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(res.locals.accountData.account_id)

  // Populate the messages with the correct names that the 
  const account_firstname = res.locals.accountData.account_firstname
  const account_lastname = res.locals.accountData.account_lastname
  const archivedMessageData = await messageModel.getArchivedCount(account_id)
  const archivedCount = archivedMessageData[0].message_archived
  const messageData = await messageModel.getMessagesByAccountId(account_id)
  const messageList = await utilities.getMessages(messageData)

  if(messageData){
        res.render("messages/inbox", {
      title: `${account_firstname} ${account_lastname} - Inbox `,
      nav,
      messageList,
      archivedCount,
      errors: null,
      
    })
  } 
}


/* ***********************
 * Final Project
 * Build/Deliver Create New Message View
 *************************/
async function buildCreateNewMessageView(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(res.locals.accountData.account_id)
  const recipientList = await utilities.getRecipient(account_id)

  res.render("messages/newMessage", {
    title: "Create a New Message",
    nav,
    errors: null,
    recipientList,
  })
}

/* ***********************
 * Final Project
 * Build/Deliver Messages View
 *************************/
async function buildArchivedMessagesView(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(res.locals.accountData.account_id)
  const messageData = await messageModel.getArchivedMessages(account_id)
  const messageList = await utilities.getMessages(messageData)

  res.render("messages/archivedMessages", {
    title: "Archived Messages",
    nav,
    errors: null,
    messageList,
  })
}

/* ***********************
 * Final Project
 * Build/Deliver Message By ID View
 *************************/
async function buildMessageByIdView(req, res, next) {
  const message_id = parseInt(req.params.messageId)

  
  const data = await messageModel.getMessageByMessageId(message_id)
  console.log(data.message_id)
  const messageGrid = await utilities.buildMessageHTML(data)

  let nav = await utilities.getNav()
  res.render("messages/message", {
    title: data.message_subject,
    nav,
    messageGrid,
    message_id,
    errors: null,
  })
}

/* ***********************
 * Final Project
 * Delete a message
 *************************/
async function deleteMessage(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(res.locals.accountData.account_id)

  const message_id = parseInt(req.params.messageId)
  
  // Populate the messages with the correct names that the 
  const account_firstname = res.locals.accountData.account_firstname
  const account_lastname = res.locals.accountData.account_lastname
  
  
  const deleteMessage = await messageModel.deleteMessage(message_id)
  const messageData = await messageModel.getMessagesByAccountId(account_id)
  const messageList = await utilities.getMessages(messageData)

  const archivedMessageData = await messageModel.getArchivedCount(account_id)
  const archivedCount = archivedMessageData[0].message_archived

  if(deleteMessage){
    req.flash("notice", `The message has been deleted.`)
    res.render("messages/inbox", {
      title: `${account_firstname} ${account_lastname} - Inbox `,
      nav,
      archivedCount,
      errors: null,
      messageList,
    })
  }
}

/* ***********************
 * Final Project
 * Build Reply View
 *************************/
async function buildReplyMessageView(req, res) {
  let nav = await utilities.getNav()
  const message_id = parseInt(req.params.messageId)
  const messageReplyData = await messageModel.getMessageByMessageId(message_id)
  const messageFromData = await accountModel.getAccountById(messageReplyData.message_from)
  const message_from = messageFromData.message_from


  const reply_subject = messageReplyData.message_subject
  
  const reply_body = messageReplyData.message_body
  console.log(reply_body)

  // Time format
  let date = new Date(messageReplyData.message_created)
  let formattedDate = date.toLocaleDateString()
  let formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })  
  let message_created = formattedDate + " Time: " + formattedTime
  
  // This is a test for the update messages - which I decided not to do. See the model it is linked to.
  // const messageResult = await messageModel.updateMessageReply(
  //   message_subject, 
  //   message_body,
  //   message_id,
  // )

  const account_email = messageFromData.account_email
  const accountFromId = messageFromData.account_id

  if (messageReplyData) {
    req.flash(
      "notice",
      `Your message has been sent!`
    )
    res.render("messages/replyMessage", {
      title: `Reply to ${messageFromData.account_firstname} ${messageFromData.account_lastname} `,
      nav,
      errors: null,
      account_email,
      accountFromId,
      message_from,
      message_id,
      message_created,
      reply_subject,
      reply_body,
    })

  } else {
    req.flash("notice", "Sorry, we were not able to send the message at this time.")
    res.render(`messages/replyMessage/${message_from}`, {
      title: `Reply to ${messageFromData.account_firstname} ${messageFromData.account_lastname} `,
      nav,
      errors: null,
      account_email,
      accountFromId,
    })
  }
}



/* ***********************
 * Final Project
 * Reply to a Message
 *************************/
async function replyToMessage(req, res) {
  let nav = await utilities.getNav()
  // Populate the messages with the correct names that the 
  const account_firstname = res.locals.accountData.account_firstname
  const account_lastname = res.locals.accountData.account_lastname
  const account_id = parseInt(res.locals.accountData.account_id)

  const { 
    message_subject, 
    message_body, 
    message_to,
    message_id,
    message_from,
  } = req.body

  const archivedMessageData = await messageModel.getArchivedCount(account_id)
  const archivedCount = archivedMessageData[0].message_archived

  // (account_id here is being used as the message_from in the query)
  const messageResult = await messageModel.addNewMessage(
    account_id,
    message_subject, 
    message_body,
    message_to,
  )
  
  // Testing an update rather than a insert new message
  // This worked, but there would need to be another page for the 'sent messages' to display the ones that were updated.
  // const messageResult = await messageModel.updateMessageReply(
  //   message_subject, 
  //   message_body,
  //   message_id,
  // )

  const messageData = await messageModel.getMessagesByAccountId(account_id)
  const messageList = await utilities.getMessages(messageData)
  const messageFromData = await accountModel.getAccountById(account_id)
  const account_email = messageFromData.account_email
  const accountFromId = messageFromData.account_id

  if (messageResult) {
    req.flash(
      "notice",
      `Your message has been sent!`
    )
    res.render("messages/inbox", {
      title: `${account_firstname} ${account_lastname} - Inbox `,
      nav,
      archivedCount,
      errors: null,
      messageList,
    })
  } else {
    req.flash("notice", "Sorry, we were not able to send the message at this time.")
    res.render(`messages/replyMessage/${message_from}`, {
      title: `Reply to ${messageFromData.account_firstname} ${messageFromData.account_lastname} `,
      nav,
      errors: null,
      account_email,
      accountFromId,
    })
  }
}


/* ***********************
 * Final Project
 * Mark a Message as Read
 *************************/
async function markAsRead(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(res.locals.accountData.account_id)

  const message_id = parseInt(req.params.messageId)
  
  // Populate the messages with the correct names that the 
  const account_firstname = res.locals.accountData.account_firstname
  const account_lastname = res.locals.accountData.account_lastname
  const archivedMessageData = await messageModel.getArchivedCount(account_id)

  const readMessage = await messageModel.markAsRead(message_id)

  const archivedCount = archivedMessageData[0].message_archived
  const messageData = await messageModel.getMessagesByAccountId(account_id)
  const messageList = await utilities.getMessages(messageData)

  if(readMessage){
    req.flash("notice", `The message has been marked as read`)
    res.render("messages/inbox", {
      title: `${account_firstname} ${account_lastname} - Inbox `,
      nav,
      archivedCount,
      errors: null,
      messageList,
    })
  }
}

/* ***********************
 * Final Project
 * Archive a Message
 *************************/
async function archiveMessage(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(res.locals.accountData.account_id)
  const message_id = parseInt(req.params.messageId)
  
  // Populate the messages with the correct names that the 
  const account_firstname = res.locals.accountData.account_firstname
  const account_lastname = res.locals.accountData.account_lastname
  const archiveMessage = await messageModel.markAsArchived(message_id)
  const archivedMessageData = await messageModel.getArchivedCount(account_id)
  const messageData = await messageModel.getMessagesByAccountId(account_id)
  const archivedCount = archivedMessageData[0].message_archived
  const messageList = await utilities.getMessages(messageData)
  
  if(archiveMessage){
    req.flash("notice", `The message has been archived`)
    res.render("messages/inbox", {
      title: `${account_firstname} ${account_lastname} - Inbox `,
      nav,
      archivedCount,
      messageList,
      errors: null,
      
    })
  }
}



/* ***********************
 * Final Project
 * Post new message to the Database
 *************************/
async function sendNewMessage(req, res) {
  let nav = await utilities.getNav()
  // Populate the messages with the correct names that the 
  const account_firstname = res.locals.accountData.account_firstname
  const account_lastname = res.locals.accountData.account_lastname
  const account_id = parseInt(res.locals.accountData.account_id)

  const { 
    message_subject, 
    message_body, 
    message_to,
  } = req.body

  const archivedMessageData = await messageModel.getArchivedCount(account_id)
  const archivedCount = archivedMessageData[0].message_archived

  // (account_id here is being used as the message_from in the query)
  const messageResult = await messageModel.addNewMessage(
    account_id,
    message_subject, 
    message_body,
    message_to,
  )

  const messageData = await messageModel.getMessagesByAccountId(account_id)
  const messageList = await utilities.getMessages(messageData)

  if (messageResult) {
    req.flash(
      "notice",
      `Your message has been sent!`
    )
    res.render("messages/inbox", {
      title: `${account_firstname} ${account_lastname} - Inbox `,
      nav,
      archivedCount,
      errors: null,
      messageList,
    })
  } else {
    console.log("This did not work")
    req.flash("notice", "Sorry, we were not able to send the message at this time.")
    res.status(501).render("messages/newMessage", {
      title: "Create a New Message",
      nav,
      errors: null,
    })
  }
}


  module.exports = { 
    buildInboxView,
    buildCreateNewMessageView,
    buildArchivedMessagesView,
    buildMessageByIdView,
    sendNewMessage,
    deleteMessage,
    archiveMessage,
    markAsRead,
    replyToMessage,
    buildReplyMessageView,
  }