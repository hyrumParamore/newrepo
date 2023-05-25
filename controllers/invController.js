const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  // console.log("build classification");
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}




invCont.buildByVehicleId = async function (req, res, next) {
  const id = req.params.classificationId
  const vehicle_data = await vehicleModel.getInventoryById(id)
  const html = await utilities.buildVehicleHtml(vehicle_data )
  let nav = await utilities.getNav()
  console.log("buildByVehicleId");
  const className = vehicle_data.classification_name
  res.render("./inventory/vehicledetails", {
    title: className + " vehicle",
    nav,
    html,
  })
}

module.exports = invCont