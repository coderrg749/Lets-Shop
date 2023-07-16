const mongoose = require('mongoose')
const validateId =(id)=>{
    const isValidId = new mongoose.Types.ObjectId(id);
if(!isValidId) throw new Error("This id is not valid")
}
module.exports =validateId
