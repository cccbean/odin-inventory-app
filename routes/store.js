const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

/* GET category listing. */
router.get('/', categoryController.index);

router.get('/items/:id', categoryController.item_detail);

router.get('/create/category', categoryController.create_category);

router.post('/create/category', categoryController.create_category_post);

router.get('/:id', categoryController.category_detail);

module.exports = router;
