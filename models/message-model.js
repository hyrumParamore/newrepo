const pool = require("../database/")

async function getAccounts(){
    return await pool.query("SELECT * FROM public.account ORDER BY account_email")
}

/* ***************************
 *  Final Project - Message System
 *  Get the Archived Message Data
 * ************************** */
async function getArchivedMessages(account_id) {
  const query = "SELECT m.message_created, m.message_id, m.message_subject, a.account_firstname, a.account_lastname, m.message_read FROM public.message m INNER JOIN public.account a on a.account_id = m.message_from WHERE m.message_to = $1 and m.message_archived = 'true' ORDER BY m.message_read, m.message_created DESC";
  const data = await pool.query(query, [account_id]);
  return data.rows;
}

/* ***************************
 *  Final Project - Message System
 *  Get the Message Data
 * ************************** */
async function getArchivedCount(account_id) {
  const query = "SELECT COUNT(message_archived) as message_archived FROM public.message WHERE message_to = $1 and message_archived = 'true'";
  const data = await pool.query(query, [account_id]);
  return data.rows;
}


/* ***************************
 *  Final Project - Message System
 *  Get the Archived Message Count
 *  DO I WANT TO MAKE IT SO THAT IF THE MESSAGE IS ARCHIVED, IT WILL STILL SHOW UP IN UNREAD?
 *  IF SO USE THIS: "SELECT COUNT(message_read) as message_read FROM public.message WHERE message_to = $1 and message_read = 'true' and message_archived = 'false'"
 * ************************** */
async function getReadMessage(account_id) {
  const query = "SELECT COUNT(message_read) as message_read FROM public.message WHERE message_to = $1 and message_read = 'false'";
  const data = await pool.query(query, [account_id]);
  return data.rows;
}


/* ***************************
 *  Final Project - Messages System
 *  this is for the list that is made in the inbox view
 *  Gets the messages by the Account ID
 * 
 *  This gets all of the messages that have not been archived and returns them.
 *
 * ************************** */
async function getMessagesByAccountId(message_to) {
  try {
    const data = await pool.query(
      // Format the time with JavaScript
      "SELECT  m.message_created, m.message_id, m.message_subject, a.account_firstname, a.account_lastname, m.message_read FROM public.message m INNER JOIN public.account a on a.account_id = m.message_from WHERE m.message_to = $1 and m.message_archived = 'false' ORDER BY m.message_read, m.message_created DESC",
      [message_to]
    )
    return data.rows
  } catch (error) {
    console.error("getMessagesByAccountId error " + error)
  }
}


/* ***************************
 *  Final Project - Messages System
 *  Gets the message by Message ID
 * ************************** */
async function getMessageByMessageId(message_id) {
  const query = "SELECT * FROM public.message m INNER JOIN public.account a on a.account_id = m.message_from WHERE message_id = $1";
  const data = await pool.query(query, [message_id]);
  return data.rows[0];
}


async function getMessages() {
  return data = await pool.query("SELECT * FROM public.message ORDER BY message_id");
}


/* *****************************
*   Final Project - Messaging System
*   INSERT new message into the database
*   (message_from is pulling the account_id from the body)
* *************************** */
async function addNewMessage(message_from, message_subject, message_body, message_to){
  try {
    const sql = "INSERT INTO public.message (message_from, message_subject, message_body, message_to) VALUES ($1, $2, $3, $4);"
    return await pool.query(sql, [message_from, message_subject, message_body, message_to])
  } catch (error) {
    return error.message
  }
}


// ******************************************************************************************************************
//  I should probably update below these to be POST methods with buttons and 
//  actions rather than a simple function with an onclick event.

/* *****************************
*   Final Project - Messaging System
*   Updates the message to me "Marked as Read"
* *************************** */
async function markAsRead(message_id){
  try {
    const sql = "UPDATE public.message SET message_read = 'true' WHERE message_id = $1 RETURNING *"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Final Project - Messaging System
*   Updates the message to me "Marked as Archived"
* *************************** */
async function markAsArchived(message_id){
  try {
    const sql = "UPDATE public.message SET message_archived = 'true' WHERE message_id = $1 RETURNING *"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Final Project - Messaging System
*  Deletes a selected message by message_id
* ************************** */
async function deleteMessage(message_id) {
  try {
    const sql = 'DELETE FROM public.message WHERE message_id = $1'
    const data = await pool.query(sql, [message_id])
  return data
  } catch (error) {
    new Error("Delete Message Error")
  }
}


/* ***************************
*  Final Project - Messaging System
*  Update Message Reply - This makes sense because when you reply to a message, you are really just updating the current one.
*  This was a test, and it worked, but there are more checks that need to happen and another page for sent messages.
* ************************** */
// async function updateMessageReply(message_subject, message_body, message_id){
//   try {
//     const sql = "UPDATE public.message SET message_subject = $1, message_body = $2, message_read = 'true' WHERE message_id = $3 RETURNING *"
//     return await pool.query(sql, [message_subject, message_body, message_id ])
//   } catch (error) {
//     return error.message
//   }
// }

// ******************************************************************************************************************




module.exports = { 
  getArchivedCount,
  getArchivedMessages,
  getMessages,
  getMessagesByAccountId,
  getMessageByMessageId,
  addNewMessage,
  getReadMessage,
  getAccounts,
  markAsRead,
  markAsArchived,
  deleteMessage,
  // updateMessageReply,
}