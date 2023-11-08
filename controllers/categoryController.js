const Category = require(`../models/category`);
const Item = require('../models/item');

const asyncHandler = require(`express-async-handler`);

exports.index = asyncHandler(async (req, res, next) => {
	const [numberOfCategories, categories] = await Promise.all([
		Category.countDocuments().exec(),
		Category.find().sort({ name: 1 }).exec()
	]);
	res.render('store', {
		title: 'Store',
		numberOfCategories,
		categories
	});
});

exports.category_detail = asyncHandler(async (req, res, next) => {
	const [category, items] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Item.find({ category: req.params.id }).sort({ name: 1 }).exec()
	]);
	res.render('category_detail', {
		title: category.name,
		description: category.description,
		items
	});
});

exports.item_detail = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id);
	res.render('item_detail', {
		title: item.name,
		description: item.description,
		price: item.price,
    numberInStock: item.numberInStock
	});
});

exports.create_category = asyncHandler(async (req, res, next) => {
	res.render('create_category');
})

exports.create_category_post = asyncHandler(async (req, res, next) => {
	res.send('Form submitted, jk');
})