const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    averagePrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

holdingSchema.index({ user: 1, symbol: 1 });

module.exports = mongoose.model('Holding', holdingSchema);