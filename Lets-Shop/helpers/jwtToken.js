const JWT = require('jsonwebtoken')

const generateToken =(id,email)=>{
    return JWT.sign({id:id,email:email},process.env.SECRET_KEY,{expiresIn:'2h'})
};

const verifyToken = async(token)=>{
return JWT.verify(token,process.env.SECRET_KEY);
}

module.exports={
    generateToken,
    verifyToken
}