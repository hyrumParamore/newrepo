const pool = require("../database/")

/* *****************************
*   Register new account
*   Unit 4 
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}


/* **********************
 *   Check for existing email
 *   Unit 4
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Unit 5 Activity
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Unit 5 Assignment
* Returns the Account type
* ***************************** */
async function getAccountType (account_email) {
  try {
    const result = await pool.query(
      "SELECT account_type FROM account WHERE (account_type = 'Employee' OR account_type = 'Admin') AND account_email = '$1'",
      [ account_email ])
    return result.rows[0]
  } catch (error) {
    return new Error("No match.")
  }
}


/* *****************************
* Unit 5 Assignment
* Returns Account ID
* ***************************** */
async function getAccountById(account_id) {
  const query = "SELECT * FROM public.account WHERE account_id = $1";
  const data = await pool.query(query, [account_id]);
  return data.rows[0];
}

/* *****************************
* Final Project - Messaging System
* Returns Accounts
* ***************************** */
async function getAccounts(){
  return await pool.query("SELECT * FROM public.account ORDER BY account_email")
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id,
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Unit 5 Task 4
 *  Update Password 
 * ************************** */
async function updatePassword(
  account_password,
  account_id,
) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      account_password,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


/* ***************************
 *  Final Project - Message System
 *  Get the Message Data
 * ************************** */
async function getArchivedMessage(account_id) {
  const query = "SELECT COUNT(message_archived) as message_archived FROM public.message WHERE message_to = $1 and message_archived = 'true'";
  const data = await pool.query(query, [account_id]);
  return data.rows;
}

/* ***************************
 *  Final Project - Message System
 *  Get the Message Data
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
 *  Crazy big query this is haha!
 * ************************** */
async function getMessagesByAccountId(message_to) {
  try {
    const data = await pool.query(
      "SELECT TO_CHAR(m.message_created, 'MM/DD/YYYY, HH:MI:SS AM') as message_created, m.message_id, m.message_subject, a.account_firstname, a.account_lastname, m.message_read FROM public.message m INNER JOIN public.account a on a.account_id = m.message_from WHERE m.message_to = $1 and m.message_archived = 'false' ORDER BY m.message_read, m.message_created DESC",
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





module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail,
  getAccountType,
  updateAccount,
  getAccountById,
  updatePassword,
  getArchivedMessage,
  getMessages,
  getMessagesByAccountId,
  getMessageByMessageId,
  addNewMessage,
  getReadMessage,
  getAccounts,
  markAsRead,
}