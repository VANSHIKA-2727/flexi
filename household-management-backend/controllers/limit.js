const limit = require('../models/limit');

const limitExpense = async (req, res) => {
    console.log("aaya 3");
    const { category, amount } = req.body;
    console.log(category);
    console.log(amount);

    try {
      console.log("aa gaya");

        const newlimit = new limit({
            
            category,
            amount,

        });
        console.log("save");
        await newlimit.save();
        const all=await limit.find();
        console.log(all);
        res.status(201).json(all);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    limitExpense,
};
