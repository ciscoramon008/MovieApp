const express = require('express'),
    router = express.Router(),
    Movie = require('../models/movie'),
    Actor = require('../models/actor'),
    middleware = require('../middlewares'),
    userFunctions = require('../user_defined_functions/userFunctions');

//===================================================================================
//ACTORS ROUTES

//SHOW ALL ACTORS
router.get('/actors', (req, res) => {
    Actor.find({}, (err, actors) => {
        if (err) {
            console.log(err);
        } else {
            res.render('actors/actors', {actors: actors});
        }
    });
});

//SHOW FORM TO ADD NEW ACTORS
router.get('/actors/new', middleware.youAdmin, (req, res) => {
    res.render('actors/new');
});

//ADD A NEW ACTOR TO DATABASE
router.post('/actors', middleware.youAdmin, (req, res) => {
    var newActor = {
        name: userFunctions.title(req.body.name),
        image: req.body.image,
        dob: req.body.dob,
        bio: req.body.bio,
    }
    Actor.create(newActor, (err, actor) => {
        if (err) {
            console.log(err);
        } else {
            console.log(actor);
            res.redirect('/actors');
        }
    });
});

//SHOW ALL DETAILS ABOUT AN ACTOR
router.get('/actors/:id', (req, res) => {
    Actor.findById(req.params.id).populate({path: 'movies', model: Movie}).populate({path: 'upcomingMovies', model: Movie}).exec((err, foundActor) => {
        if (err) {
            console.log(err);
        } else {
            res.render('actors/show', {actor: foundActor});
        }
    });
});

//DELETE AN ACTOR FROM THE DATABASE
router.delete('/actors/:id', middleware.youAdmin, (req, res)=>{
    Actor.findOne({_id: req.params.id}, (err, foundActor)=>{
        //FOR ALL THE MOVIES THE ACTOR HAS DONE REMOVE THAT ACTOR FROM THE MOVIE'S ACTORS LIST
        foundActor.movies.forEach((movie)=>{
            Movie.findOne({_id: movie}, (err, foundMovie)=>{
                for(i=0; i<foundMovie.actors.length; i++){
                    if(String(foundMovie.actors[i]) == String(foundActor._id)){
                        break;
                    }
                }
                foundMovie.actors.splice(i, 1);
                foundMovie.save();
            });
        })
    });

    Actor.findByIdAndDelete(req.params.id, (err, deletedActor)=>{
        if(err){
            console.log(err);
        } else {
            console.log('Actor deleted');
            res.redirect('/actors');
        }
    });
});

module.exports = router;