const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    console.log(' getAllSauces Requête reçue !');
    Sauce.find()
    .then(sauces =>
        {
            if( !sauces)
            {
                console.log(' Aucune sauce !');
                res.status(200).json({ error: 'Aucune sauce !' });
            }
            
            else{
                console.log(' sauce(s) trouvée(s) !');
                res.status(200).json(sauces);
            }
            
        } )
        .catch(error => res.status(400).json({ error }));
    };
    
    exports.addOneSauce = (req, res, next) => {
        const sauceObject = JSON.parse(req.body.sauce)
        delete sauceObject._id;
        sauceObject.likes = 0;
        sauceObject.dislikes = 0;
        
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
    };
    
    exports.getOneSauce = (req, res, next) => {
        console.log(' getOneSauce Requête reçue !');
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
    };
    
    exports.deleteOneSauce = (req, res, next) => {
        console.log(' deleteOneSauce Requête reçue !');
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée!'}))
                .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
    };
    
    exports.updateOneSauce = (req, res, next) => {
        console.log(' updateOneSauce Requête reçue !');
        
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // La méthode JSON.parse() analyse une chaîne de caractères JSON et construit la valeur JavaScript 
            // ou l'objet décrit par cette chaîne
            
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                
                const sauceObject = req.file ?
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };
                
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                .catch(error => res.status(400).json({ error }));
                
            });
            
        })
        .catch(error => res.status(500).json({ error }));
    };
    
    exports.like = (req, res, next) => {

        var userId = req.body.userId;
        var like = req.body.like;
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {            
            let userId_found = false;
            // recherche userId dans tableau usersLiked
            sauce.usersLiked.forEach(userLiked => {
                console.log("for each sauce usersLiked len : "+ userLiked);
                if( userId == userLiked)
                {
                    userId_found = true;
                    if( like == 0) // supression du like
                    {
                        if(sauce.likes>0)
                        {
                            sauce.likes -= 1;
                            let pos = sauce.usersLiked.indexOf(userId);
                            sauce.usersLiked.splice(pos, 1);
                        }                       
                    }
                }
            } );
            
            if( !userId_found ) // ajout du like
            {
                if( like == 1){
                    sauce.likes += 1;
                    sauce.usersLiked.push(userId); // ajout dans le tableau
                }
            }

            // recherche userId dans tableau usersDisliked
            sauce.usersDisliked.forEach(userDisliked => {
                console.log("for each sauce usersDisliked len : "+ userDisliked);
                if( userId == userDisliked)
                {
                    userId_found = true;
                    if( like == 0) // supression du dislike
                    {
                        if(sauce.dislikes>0)
                        {
                            sauce.dislikes -= 1;
                            let pos = sauce.usersDisliked.indexOf(userId);
                            sauce.usersDisliked.splice(pos, 1);
                        }                        
                    }
                }
            } );
            
            if( !userId_found ) // ajout du dislike
            {
                if( like == -1){
                    sauce.dislikes += 1;
                    sauce.usersDisliked.push(userId); // ajout dans le tableau
                }
            }
            
            const sauceObject =
            {
                likes:sauce.likes,
                dislikes:sauce.dislikes,
                usersLiked:sauce.usersLiked,
                usersDisliked:sauce.usersDisliked
            };
                        
            Sauce.updateOne({ _id: req.params.id }, {...sauceObject , _id: req.params.id } )
            .then(() => res.status(200).json({ message: 'sauce évaluée !'}))
            .catch(error => res.status(400).json({ error }));  
        })
        .catch(error => res.status(500).json({ error }));
    };