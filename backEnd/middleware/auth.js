// ------------------------- IMPORTS ------------------------

const jwToken = require('jsonwebtoken');
const dotEnv = require('dotenv'); 

// ============================================================
// ---------------------- Middlewares -------------------------

module.exports = (req, res, next) => {
    try {
        dotEnv.config() // Appel de dotEnv pour le secret key token

        // Recupère le token et vérifie son authenticité 
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwToken.verify(token, process.env.TOKEN_KEY);
        const userId = decodedToken.userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        }

        else {
            next();
        }
    }

    catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};

 