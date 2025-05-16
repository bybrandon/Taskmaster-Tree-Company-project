(async function() {

require("dotenv").config();

const mongoose = require("mongoose");

await mongoose.connect(process.env.MONGODB_URI);

const Tree = require('./models/tree');


const treeData = [
    {
        description: 'Oak Tree',
        price: 199.99,
    },
    {
        description: 'Pine Tree',
        price: 399.99,
    },
    {
        description: 'Baobab Tree',
        price: 899.99,
    },
];

// Delete all trees to prevent duplicates
await Tree.deleteMany({});

const trees = await Tree.create(treeData);

console.log(trees);

process.exit();
})();