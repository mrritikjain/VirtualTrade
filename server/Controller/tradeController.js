const Holding = require('../models/Holding');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// BUY STOCK
module.exports.buyStock = async function (req, res) {
    try {
        const { symbol, quantity, price, currentPrice } = req.body;
        const numQty = Number(quantity);
        const numPrice = Number(price || currentPrice);

        if (!symbol || !numQty || numQty <= 0 || !numPrice || numPrice <= 0) {
            return res.status(400).json({ success: false, msg: "Valid symbol, quantity, and price are required" });
        }

        const totalCost = numPrice * numQty;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        if (user.credits < totalCost) {
            return res.status(400).json({ success: false, msg: "Insufficient credits" });
        }

        // Deduct credits from user
        user.credits -= totalCost;
        await user.save();

        // Update or create holding
        let holding = await Holding.findOne({
            user: req.user._id,
            symbol: symbol.toUpperCase()
        });

        if (holding) {
            // Calculate new weighted average price
            const existingTotal = holding.quantity * holding.averagePrice;
            const newTotal = existingTotal + totalCost;
            holding.quantity += numQty;
            holding.averagePrice = Number((newTotal / holding.quantity).toFixed(2));
            await holding.save();
        } else {
            holding = new Holding({
                user: req.user._id,
                symbol: symbol.toUpperCase(),
                quantity: numQty,
                averagePrice: numPrice
            });
            await holding.save();
        }

        // Record the transaction
        const transaction = new Transaction({
            user: req.user._id,
            symbol: symbol.toUpperCase(),
            type: "BUY",
            quantity: numQty,
            price: numPrice,
            totalPrice: totalCost
        });
        await transaction.save();

        return res.status(200).json({
            success: true,
            msg: "Stock bought successfully",
            credits: user.credits,
            holding
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal server error", error: error.message });
    }
};

// SELL STOCK
module.exports.sellStock = async function (req, res) {
    try {
        const { symbol, quantity, price, currentPrice } = req.body;
        const numQty = Number(quantity);
        const numPrice = Number(price || currentPrice);

        if (!symbol || !numQty || numQty <= 0 || !numPrice || numPrice <= 0) {
            return res.status(400).json({ success: false, msg: "Valid symbol, quantity, and price are required" });
        }

        const holding = await Holding.findOne({
            user: req.user._id,
            symbol: symbol.toUpperCase()
        });

        if (!holding) {
            return res.status(400).json({ success: false, msg: "Holding not found. You do not own this stock." });
        }

        if (holding.quantity < numQty) {
            return res.status(400).json({ success: false, msg: `Insufficient holdings. You only have ${holding.quantity} shares.` });
        }

        const totalProceeds = numPrice * numQty;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        // Add proceeds to user credits
        user.credits += totalProceeds;
        await user.save();

        // Update or delete holding
        holding.quantity -= numQty;
        if (holding.quantity === 0) {
            await Holding.deleteOne({ _id: holding._id });
        } else {
            await holding.save();
        }

        // Record the transaction
        const transaction = new Transaction({
            user: req.user._id,
            symbol: symbol.toUpperCase(),
            type: "SELL",
            quantity: numQty,
            price: numPrice,
            totalPrice: totalProceeds
        });
        await transaction.save();

        return res.status(200).json({
            success: true,
            msg: "Stock sold successfully",
            credits: user.credits
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal server error", error: error.message });
    }
};

// GET USER HOLDINGS / PORTFOLIO
module.exports.getPortfolio = async function (req, res) {
    try {
        const holdings = await Holding.find({ user: req.user._id });
        return res.status(200).json({ success: true, holdings });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal server error", error: error.message });
    }
};

// GET USER TRANSACTION HISTORY
module.exports.getHistory = async function (req, res) {
    try {
        const history = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, history });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal server error", error: error.message });
    }
};