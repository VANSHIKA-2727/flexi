const mongoose = require('mongoose');

const limitSchema = new mongoose.Schema({
    category: { type: String, required: true },
    amount: { type: Number, required: true },
});

const limit = mongoose.model('limit', limitSchema);

module.exports = limit;
