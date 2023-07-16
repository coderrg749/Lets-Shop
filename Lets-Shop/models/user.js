const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const crypto = require('crypto')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true, 
    },
    lastname:{
        type:String,
        required:true, 
    },
    email:{
        type:String,
        required:[true,"provide your email here"],
        unique:true
    },
    mobile:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: "user",
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
    cart: {
        type: Array,
        default: [],
      },
      wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      address: {
        type: String,
      },
      refreshToken:{
        type:String
      },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},{ timestamps: true});




userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    next();
  }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
    next();
})

userSchema.methods.isPasswordMatched = async function (enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)
}
userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resettoken;
};

module.exports = mongoose.model('User', userSchema);