#! /usr/bin/env node

console.log(
  'This script populates some test items and categoryies to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await populateCategoriesArray();
  await populateItemsArray();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createCategory(index, name, description) {
  const category = new Category({name, description});
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createItem(index, name, description, price, numberInStock, category) {
  const item = new Item({
    name,
    description,
    price,
    numberInStock,
    category
  });
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function populateCategoriesArray() {
  console.log(`Adding categories`);
  await Promise.all([
    createCategory(0, `Electronics`, `Things powered by silicon and dreams`),
    createCategory(1, `Clothing`, `Fabric for the heart and soul`),
    createCategory(2, `Furniture`, `A place to rest`),
  ]);
}

async function populateItemsArray() {
  console.log(`Adding items`);
  await Promise.all([
    createItem(0, `Laptop`, `May cause lap to set on fire`, 50000, 426, categories[0]),
    createItem(1, `Computer`, `Monitor not included`, 32500, 20, categories[0]),
    createItem(2, `Shirt`, `Cover your nipples`, 2500, 999, categories[1]),
    createItem(3, `Underwear`, `Only show your bottom to those who truly appreciate it`, 500, 500, categories[1]),
    createItem(4, `Desk`, `Place for electronics and work`, 22500, 35, categories[2]),
    createItem(5, `Bed`, `You can't walk forever`, 30000, 50, categories[2]),
  ])
}