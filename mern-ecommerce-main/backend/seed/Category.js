const Category = require("../models/Category");

const categories = [
  { _id: "65a7e24602e12c44f599442c", name: "Genuine Honda Bike Parts" },
  { _id: "65a7e24602e12c44f5994432", name: "Modification Parts" },
  { _id: "65a7e24602e12c44f5994433", name: "Fuel Tanks" },
  { _id: "65a7e24602e12c44f5994434", name: "Vendor Parts" }, 
  { _id: "65a7e24602e12c44f5994438", name: "Others" }
];


exports.seedCategory = async () => {
  try {
    await Category.insertMany(categories);
    console.log("Category seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
