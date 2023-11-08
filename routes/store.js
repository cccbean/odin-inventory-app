const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

/* GET category listing. */
router.get('/', categoryController.index);

router.get('/items/:id', categoryController.item_detail);

router.get('/items/:id/delete', categoryController.item_delete_get);

router.post('/items/:id/delete', categoryController.item_delete_post);

router.get('/items/:id/update', categoryController.item_update_get);

router.post('/items/:id/update', categoryController.item_update_post);

router.get('/create/category', categoryController.create_category);

router.post('/create/category', categoryController.create_category_post);

router.get('/create/item', categoryController.create_item);

router.post('/create/item', categoryController.create_item_post);

router.get('/:id', categoryController.category_detail);

router.get('/:id/delete', categoryController.category_delete_get);

router.post('/:id/delete', categoryController.category_delete_post);

router.get('/:id/update', categoryController.category_update_get);

router.post('/:id/update', categoryController.category_update_post);

module.exports = router;
