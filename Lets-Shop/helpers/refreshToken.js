const JWT = require('jsonwebtoken')

const generateRefreshToken =(id)=>{
    return JWT.sign({id:id},process.env.SECRET_KEY,{expiresIn:'1d'})
};
const verifyRefreshToken=(token)=>{
    let decodedData =  JWT.verify(token,process.env.SECRET_KEY,(err, decoded) => {
        if (err || user.id !== decoded.id) {
          throw new Error("There is something wrong with token");
        }})
        console.log("decode",decodedData)
        return decodedData;
}

module.exports={generateRefreshToken,verifyRefreshToken};