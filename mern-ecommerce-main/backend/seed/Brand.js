const Brand = require("../models/Brand");

const brands = [
  { _id: "65a7e20102e12c44f59943da", name: "Honda" },
  { _id: "65a7e20102e12c44f59943db", name: "Yamaha" },
  { _id: "65a7e20102e12c44f59943dc", name: "Crown Motorcycle Parts" },
  { _id: "65a7e20102e12c44f59943dd", name: "Zxmco Motorcycle Accessories" },
  { _id: "65a7e20102e12c44f59943de", name: "Hi-speed Bike Parts" },
  { _id: "65a7e20102e12c44f59943df", name: "United Bike Parts" },
  { _id: "65a7e20102e12c44f59943e0", name: "Road Prince Bike Parts" },
  { _id: "65a7e20102e12c44f59943e1", name: "Union Star Motorcycle Parts" },
  { _id: "65a7e20102e12c44f59943e2", name: "Unique bike spare parts" },
  { _id: "65a7e20102e12c44f59943e3", name: "Ravi motorcycle parts" },
 
];


exports.seedBrand = async () => {
  try {
    await Brand.insertMany(brands);
    console.log('Brand seeded successfully');
  } catch (error) {
    console.log(error);
  }
};
