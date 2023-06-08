const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

// This is the for the Error link at the bottom of the footer
// baseController.buildError = async function(req, res){
//   // const nav = await utilities.getNav()
//   res.render("./views/errors/error", {title: "Error", nav})
// }

module.exports = baseController