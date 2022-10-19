const passwordValid = require('password-validator');

// creer un schema de validation
const passwordSchema = new passwordValid();
// lui ajouter des propriétés
passwordSchema
.is().min(8)
.is().max(50)
.has().digits(2)
.has().not().spaces()

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    } else {
        return res.status(400).json({ error : "Le mot de passe n'est pas assez puissant !" + passwordSchema.validate('req.body.password', {list: true})})
        
    }
    
}

