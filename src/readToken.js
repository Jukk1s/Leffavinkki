const jwt = require('jsonwebtoken');

function readId(token){
    return jwt.verify(token, process.env.TOKEN_SECRET).id;
}

exports.readId = readId;