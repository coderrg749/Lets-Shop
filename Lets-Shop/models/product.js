const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,

    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Category"
        type: String,
        required: true
    }, brand: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        required: true

    },
    ratings: [{
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment:String
    }
    ], sold: {
        type: Number,
        default: 0,
        select:false //this will hide this field
    },
    totalrating: {
        type: String,
        default: 0,
      },
      averagerating: {
        type: String,
        default: 0,
      }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);