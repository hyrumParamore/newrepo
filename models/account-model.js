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



module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail,
  getAccountType,
  updateAccount,
  getAccountById,
  updatePassword,
  getAccounts,
}