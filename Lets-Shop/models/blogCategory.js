const mongoose = require('mongoose')
const blogCategorySchema = mongoose.Schema({
name:{
    type:String,
    required:[true,'Please add a name'],
    unique:true,
    index:true
}
},{timestamps:true})

module.exports=mongoose.model('BlogCategory',blogCategorySchema)