const JWT  = require('jsonwebtoken');

const secret = "Wali123@";

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        profileIMmageURl : user.profileImageURL,
    };
    const token = JWT.sign(payload, secret);
    return token;

}

function validateToken(token){
  const payload = JWT.verify(token, secret);
  return payload;   
}

module.exports= {
    createTokenForUser,
    validateToken,
}