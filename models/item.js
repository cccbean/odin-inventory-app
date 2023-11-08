const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ItemSchema = new Schema({
	name: String,
	description: String,
	price: Number,
	numberInStock: Number,
	category: { type: Schema.Types.ObjectId, ref: 'Category' }
});

ItemSchema.virtual('url').get(function () {
	return `/store/items/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
