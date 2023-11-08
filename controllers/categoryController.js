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
		id: req.params.id,
		items
	});
});

exports.item_detail = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id);
	res.render('item_detail', {
		title: item.name,
		description: item.description,
		price: item.price,
		numberInStock: item.numberInStock,
		id: req.params.id
	});
});

exports.create_category = asyncHandler(async (req, res, next) => {
	res.render('create_category', {
		errors: []
	});
});

const { body, validationResult } = require('express-validator');

exports.create_category_post = [
	body('categoryName', 'Category name cannot be empty').trim().isLength({ min: 1 }).escape(),

	body('categoryDescription', 'Category description cannot be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const category = new Category({
			name: req.body.categoryName,
			description: req.body.categoryDescription
		});

		if (!errors.isEmpty()) {
			res.render('create_category', { errors: errors.array() });
			return;
		} else {
			const categoryExists = await Category.findOne({ name: req.body.name }).exec();

			if (categoryExists) {
				res.redirect(categoryExists.url);
			} else {
				await category.save();
				res.redirect(category.url);
			}
		}
	})
];

exports.create_item = asyncHandler(async (req, res, next) => {
	const categories = await Category.find().sort({ name: 1 }).exec();

	res.render('create_item', {
		categories,
		errors: []
	});
});

exports.create_item_post = [
	body('itemName', 'Item name cannot be empty').trim().isLength({ min: 1 }).escape(),
	body('itemDescription', 'Item description cannot be empty').trim().isLength({ min: 1 }).escape(),
	body('itemPrice', 'Item price cannot be empty').trim().isLength({ min: 1 }).escape(),
	body('itemInStock', 'Item amount in stock cannot be empty').trim().isLength({ min: 1 }).escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const category = await Category.findOne({ name: req.body.itemCategory });

		const item = new Item({
			name: req.body.itemName,
			description: req.body.itemDescription,
			price: req.body.itemPrice,
			numberInStock: req.body.itemInStock,
			category: category._id
		});

		if (!errors.isEmpty()) {
			const categories = await Category.find().sort({ name: 1 }).exec();

			res.render('create_item', {
				categories,
				errors: errors.array()
			});
			return;
		} else {
			const itemExists = await Item.findOne({ name: req.body.name }).exec();

			if (itemExists) {
				res.redirect(itemExists.url);
			} else {
				await item.save();
				res.redirect(item.url);
			}
		}
	})
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id).exec();
	res.render('delete_item', {
		name: item.name,
		id: req.params.id
	});
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
	console.log(req.params.id);
	await Item.findByIdAndDelete(req.params.id);
	res.redirect('/store');
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id).exec();
	res.render('delete_category', {
		name: category.name,
		id: req.params.id
	});
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
	await Category.findByIdAndDelete(req.params.id);
	res.redirect('/store');
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id).exec();
	res.render('update_category', {
		name: category.name,
		description: category.description,
		errors: [],
		id: req.params.id
	});
});

exports.category_update_post = [
	body('categoryName', 'Category name cannot be empty').trim().isLength({ min: 1 }).escape(),

	body('categoryDescription', 'Category description cannot be empty')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const category = new Category({
			name: req.body.categoryName,
			description: req.body.categoryDescription,
			_id: req.params.id
		});

		if (!errors.isEmpty()) {
			res.render('update_category', {
				name: category.name,
				description: category.description,
				errors: errors.array()
			});
			return;
		} else {
			const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category);
			res.redirect(updatedCategory.url);
		}
	})
];

exports.item_update_get = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id).exec();
	const itemCategory = await Category.findById(item.category).exec();
	const categories = await Category.find().sort({ name: 1 }).exec();

	res.render('update_item', {
		name: item.name,
		description: item.description,
		price: item.price,
		inStock: item.numberInStock,
		itemCategory: itemCategory.name,
		categories,
		errors: [],
		id: req.params.id
	});
});

exports.item_update_post = [
	body('itemName', 'Item name cannot be empty').trim().isLength({ min: 1 }).escape(),
	body('itemDescription', 'Item description cannot be empty').trim().isLength({ min: 1 }).escape(),
	body('itemPrice', 'Item price cannot be empty').trim().isLength({ min: 1 }).escape(),
	body('itemInStock', 'Item amount in stock cannot be empty').trim().isLength({ min: 1 }).escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const category = await Category.findOne({ name: req.body.itemCategory });

		const item = new Item({
			name: req.body.itemName,
			description: req.body.itemDescription,
			price: req.body.itemPrice,
			numberInStock: req.body.itemInStock,
			category: category._id,
			_id: req.params.id
		});

		if (!errors.isEmpty()) {
			const categories = await Category.find().sort({ name: 1 }).exec();

			res.render('update_item', {
				name: item.name,
				description: item.description,
				price: item.price,
				inStock: item.numberInStock,
				itemCategory: itemCategory.name,
				categories,
				errors: errors.array(),
				id: req.params.id
			});
			return;
		} else {
			const updatedItem = await Item.findByIdAndUpdate(req.params.id, item);
			res.redirect(updatedItem.url);			
		}
	})
];
