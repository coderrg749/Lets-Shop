const mongoose = require('mongoose')
const productCategorySchema = mongoose.Schema({
name:{
    type:String,
    required:[true,'Please add a name'],
    unique:true,
    index:true
}
},{timestamps:true})

module.exports=mongoose.model('ProductCategory',productCategorySchema)