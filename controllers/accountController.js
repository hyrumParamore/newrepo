/* ***********************
 * Account Controller
 * Unit 4 Activity
 *************************/
const accountModel = require("../models/account-model")
const utilities = require('../utilities')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ***********************
 * Deliver login view
 * Unit 4 deliver login view activity
 *************************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}


/* ***********************
 * Deliver Register view
 * Unit 4 deliver register view activity
 *************************/
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
}


/* ***********************
 * Deliver Account view
 * Unit 5 deliver account team-activity
 *************************/
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()

  // This adds in the number of unread messages
  const account_id = parseInt(res.locals.accountData.account_id)
  const messageData = await accountModel.getReadMessage(account_id)
  console.log(messageData[0].message_read)
  const readMessages = messageData[0].message_read

  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
    readMessages,
  })
}





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

  const messageData = await accountModel.getArchivedMessage(account_id)
  const messageList = await utilities.getMessages(account_id, account_firstname, account_lastname)
  const archivedCount = messageData[0].message_archived



  if(messageData){
    // req.flash("notice", `${account_id}: ${messageData.message_to}`)
    res.render("account/inbox", {
      title: `Name goes here - Inbox `,
      nav,
      archivedCount,
      errors: null,
      messageList,
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

  res.render("account/newMessage", {
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

  res.render("account/archivedMessages", {
    title: "Archived Messages",
    nav,
    errors: null,
  })
}

/* ***********************
 * Final Project
 * Build/Deliver Message By ID View
 *************************/
async function buildMessageByIdView(req, res, next) {
  const message_id = parseInt(req.params.messageId)
  

  const data = await accountModel.getMessageByMessageId(message_id)
  const messageGrid = await utilities.buildMessageHTML(data)
  let nav = await utilities.getNav()
  res.render("account/message", {
    title: data.message_subject,
    nav,
    messageGrid,
    errors: null,
  })
}



/* ***********************
 * Final Project
 * Post new message to the Database
 *************************/
async function sendNewMessage(req, res) {
  let nav = await utilities.getNav()

  const account_id = parseInt(res.locals.accountData.account_id)

  const { 
    message_subject, 
    message_body, 
    message_to,
  } = req.body

  const messageData = await accountModel.getArchivedMessage(account_id)

  
  const archivedCount = messageData[0].message_archived

  // (account_id here is being used as the message_from in the query)
  const messageResult = await accountModel.addNewMessage(
    account_id,
    message_subject, 
    message_body,
    message_to,
  )

  const messageList = await utilities.getMessages(account_id)

  if (messageResult) {
    req.flash(
      "notice",
      `Your message has been sent!`
    )
    res.status(201).render("account/inbox", {
      title: "Inbox",
      nav,
      errors: null,
      archivedCount,
      messageList,
    })
    // return res.redirect("/account/inbox")
  } else {
    console.log("This did not work")
    req.flash("notice", "Sorry, we were not able to send the message at this time.")
    res.status(501).render("account/newMessage", {
      // Will need to add the select list later here
      title: "Create a New Message",
      nav,
      errors: null,
    })
  }
}


// *********************************************************************







/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, 
    account_lastname, 
    account_email, 
    account_password 
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Unit 5 activities
*  Process login request
* ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }




 /* ***************************
 *  Build edit account view
 *  Unit 5 Task 4
 * ************************** */
async function editAccountView(req, res, next) {
  const account_id = parseInt(res.locals.accountData.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("./account/editAccount", {
    title: `Edit Account`,
    nav,
    errors: null,
    account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    
  })
}


 /* ****************************************
*  Unit 5 Task 4
*  Update Account Info
* ************************************ */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  )

  const accountData = await accountModel.getAccountById(account_id)

  if (updateResult) {
    res.clearCookie("jwt")
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    req.flash("notice", `Your account has been updated.`)
    return res.redirect("/account/")

  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/editAccount", {
      title: "Edit your account:",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

 /* ****************************************
*  Unit 5 Task 4
*  Update Account Info
* ************************************ */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_password,
    account_id,
  } = req.body

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error updating the password.')
    res.status(500).render("account/editAccount", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id,
  )

  const accountData = await accountModel.getAccountById(account_id)

  if (updateResult) {
    req.flash("notice", `Your password has been updated!`)
    res.clearCookie("jwt")
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return res.redirect("/account/")

  } else {
    req.flash("notice", "Sorry, updating your password failed.")
    res.status(501).render("account/editAccount", {
      title: "Edit your account:",
      nav,
      errors: null,
    })
  }
}


 /* ***************************
 *  Logout account
 *  Unit 5 Task 6
 * ************************** */
 async function logoutAccount(req, res, next) {
  res.clearCookie("jwt")
  res.redirect("../")
}



  
  module.exports = { 
    buildLogin, 
    buildRegister, 
    registerAccount, 
    accountLogin, 
    buildAccountManagement,
    editAccountView,
    updateAccount,
    updatePassword,
    logoutAccount,
    buildInboxView,
    buildCreateNewMessageView,
    buildArchivedMessagesView,
    buildMessageByIdView,
    sendNewMessage,
  }