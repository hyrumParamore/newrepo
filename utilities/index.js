const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the classification select
 ************************** */
Util.getClassifications = async function (selectedClassification, req, res, next) {
  let data = await invModel.getClassifications()
  let selectList = '<select name="classification_id" id="select_classification" class="select-classification">'
  data.rows.forEach((row) => {
    let selected = ""
    if (selectedClassification == row.classification_id) {
      selected = "selected"
    }
    selectList += '<option id="' + row.classification_id + '"  value=' + row.classification_id + ' ' + selected + '>' + row.classification_name + '</option>'

  })
  selectList += '</select>'
  return selectList
}


/* ************************
 * Constructs the select for the messaging recipient
 ************************** */
Util.getRecipient = async function (selectRecipient, req, res, next) {
  let data = await accountModel.getAccounts()
  let recipientList = '<select name="message_to" id="select_account" class="select-account">'
  data.rows.forEach((row) => {
    let selected = ""
    if (selectRecipient == row.account_id) {
      selected = "selected"
    }
    recipientList += '<option id="' + row.account_id + '"  value=' + row.account_id + ' ' + selected + '>' + row.account_email + '</option>'

  })
  recipientList += '</select>'
  return recipientList
}


/* ************************
 * Constructs the get message HTML and builds the table for the messages
 ************************** */
Util.getMessages = async function (account_id, req, res, next) {

  
  let data = await accountModel.getMessagesByAccountId(account_id)
  
  let messageList = '<table>' 
  messageList += '<tr>'
  messageList += '<th>Received</th>'
  messageList += '<th>Subject</th>'
  messageList += '<th>From</th>'
  messageList += '<th>Read</th>'
  messageList += '</tr>'


  messageList += data.map((row) => {
    return `
      <tr>
        <td>${row.message_created}</td>
        <td><a href="/account/inbox/${row.message_id}">${row.message_subject}</a></td>
        <td>${row.account_firstname} ${row.account_lastname}</td>
        <td>${row.message_read}</td>
      </tr>
    `;
  }).join('');
  messageList += '</tbody>'; 
  messageList += '</table>';
  
  return messageList
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div class="inv-container" id="inv-display">'
      data.forEach(vehicle => { 
        
            grid +='<div class="inv-card">'

            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
              grid += '<hr>'
              grid += '<h2>'
              // I added a class here to make the CSS easier.
              grid += '<a class="vehicle-image" href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
              + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
              + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
              grid += '</h2>'
              grid += '<span>$' 
              + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
          grid += '</div>'
          
      })
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleHtml = async function(vehicle){
  let grid
  if(vehicle){
    grid = '<div class="vehicle-content">'

      grid +=  '<img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors">'

      grid += '<div class="vehicle-details">'
        grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
        grid += '<span><b>Price:</b> $' 
          + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '<p><b>Description:</b> ' + vehicle.inv_description + '</p>'
        grid += '<p><b>Color:</b> ' + vehicle.inv_color + '</p>'
        grid += '<p><b>Miles:</b> ' + vehicle.inv_miles + '</p>'

      grid += '</div>'
    
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Final Project - Messaging System
* Build the message view HTML
* ************************************ */
Util.buildMessageHTML = async function(message){
  

  function markAsRead() {
    accountModel.markAsRead(message.message_id)
  }
  
  let messageGrid = ''
  if(message){
    messageGrid += '<div class="message-page">'
      messageGrid += '<div class="message-container">'

        messageGrid += `<p class="message-subject"> <b>Subject: </b>${message.message_subject}</p>`
        messageGrid += `<p name="message_from" class="message-from"><b>From: </b>${message.account_firstname} ${message.account_lastname}</p>`
        messageGrid += `<p class="message-message"><b>Message: </b>${message.message_body}</p>`

      messageGrid += `</div>`
      messageGrid += `<div class="message-options">`

        messageGrid += `<a title="Inbox" href="/account/inbox">Return to Inbox</a>`
        // Make it so that when this button it pressed, it will set the select list to the correct account to reply
        messageGrid += `<a href="/account/newMessage" class="message-button">Reply</a>`
        messageGrid += `<a href="/account/inbox" onclick="${markAsRead()}" class="message-button">Mark as Read</a>`
        messageGrid += `<button class="message-button">Archive Message</button>`
        messageGrid += `<button class="message-button">Delete Message</button>`

      messageGrid += `</div>`
      messageGrid += `<br>`
    messageGrid += `</div>`


  } else { 
    messageGrid += '<p class="notice">Sorry, no messages were found.</p>'
  }
  return messageGrid
}
 
  

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 *  Unit 5 jwt authorize activity
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


 /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util