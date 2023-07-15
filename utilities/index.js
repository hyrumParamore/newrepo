const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = `<ul class="navbar">`
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
  let data = await messageModel.getAccounts()
  let recipientList = '<select name="message_to" id="messageTo" class="select-account">'
  
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
Util.getMessages = async function (data, account_id, req, res, next) {
  if (!data || data.length === 0) {
    let messageList = `<h3>You don't have any messages to display.</h3>`
    return messageList; // Return an empty string if the data array is empty or falsy
  }
  
  let messageList = '<table class="message-list">' 
  messageList += '<tr>'
  messageList += '<th>Received</th>'
  messageList += '<th>Subject</th>'
  messageList += '<th>From</th>'
  messageList += '<th>Read</th>'
  messageList += '</tr>'

  messageList += data.map((row) => {
    // Format the date and time here.
    // create a new date.
    let date = new Date(row.message_created)
    let formattedTime = date.toLocaleDateString([], { hour: 'numeric', minute: '2-digit', hour12: true })

    let read = row.message_read
    if (row.message_read == "true") {
      read = true
    } else {
      read = false
    }

    return `
      <tr>
        <td><a href="/messages/${row.message_id}">${formattedTime}</a></td>
        <td><a href="/messages/${row.message_id}"><b>${row.message_subject}</b></a></td>
        <td><a href="/messages/${row.message_id}">${row.account_firstname} ${row.account_lastname}</a></td>
        <td><a href="/messages/${row.message_id}">${row.message_read}</a></td>
      </tr>
    `;
  }).join('');
  messageList += '</tbody>'; 
  messageList += '</table>';
  
  return messageList;
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

  let date = new Date(message.message_created)
  let formattedDate = date.toLocaleDateString()
  let formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })


  let messageGrid = ''
  if(message){
    messageGrid += '<div class="message-page">'
      messageGrid += '<div class="message-container">'

        messageGrid += `<p class="message-message"><b>Date: </b>${formattedDate} ${formattedTime}</p>`
        messageGrid += `<p class="message-subject"> <b>Subject: </b>${message.message_subject}</p>`
        messageGrid += `<p class="message-from"><b>From: </b>${message.account_firstname} ${message.account_lastname}</p>`
        messageGrid += `<p style="white-space: pre-wrap;" class="message-message"><b>Message: </b>\n${message.message_body}</p>`
        
      messageGrid += `</div>`
      messageGrid += `<hr class="message-hr">`
      messageGrid += `<br>`
      

      messageGrid += `<div class="message-options">`

        // Reply to Message
        messageGrid += `<form action="/messages/replyMessage/${message.message_id}">`
          messageGrid += `<button type="submit" class="message-button">Reply</button>`
        messageGrid += `</form>`

        // Only display read button if the message_read is unread
        if (message.message_read == false) {
          // Mark as Read Messages
          messageGrid += `<form action="/messages/markAsRead/${message.message_id}" method="post">`
            messageGrid += `<button type="submit" class="message-button">Mark as Read</button>`
          messageGrid += `</form>`
        }

        // Only display archive button if the message is not archived
        if (message.message_archived == false) {
          // Archive Messages
          messageGrid += `<form action="/messages/archive/${message.message_id}" method="post">`
            messageGrid += `<button type="submit" class="message-button">Archive Message</button>`
          messageGrid += `</form>`
        }
        
        // Delete Messages
        messageGrid += `<form action="/messages/delete/${message.message_id}" method="post">`
          messageGrid += `<button type="submit" class="message-button">Delete Message</button>`
        messageGrid += `</form>`

      messageGrid += `</div>`

      // Takes you back to the inbox
      messageGrid += `<br>`
      messageGrid += `<a class="inbox-link" title="Inbox" href="/messages">Return to Inbox</a>`
      
      messageGrid += `<br>`
    messageGrid += `</div>`

    messageGrid += `<input type="hidden" name="message_id" value="${message.message_id}">`



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