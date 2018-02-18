const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

//Index Route - show all campgrounds
router.get('/campgrounds', function(req, res) {
    //get all Campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            //req.user gets created by passport
            res.render('campgrounds/index', {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    });
});

//CREATE route- add new campground to DB
router.post('/campgrounds', middleware.isLoggedIn, function(req, res) {
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author
    };
    //create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to backgrounds page
            res.redirect('/campgrounds');
        }
    });
});

//NEW Route - Show form to submit new
router.get('/campgrounds/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

//SHOW Route- show details of one campsite
router.get('/campgrounds/:id', function(req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function(err, foundCampground) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundCampground);
                //render show template with that campground
                res.render('campgrounds/show', { campground: foundCampground });
            }
        });
});

//edit campground routes

router.get(
    '/campgrounds/:id/edit',
    middleware.checkCampgroundOwnership,
    function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            res.render('campgrounds/edit', {
                campground: foundCampground
            });
        });
    }
);

//update campground route
router.put('/campgrounds/:id', middleware.checkCampgroundOwnership, function(
    req,
    res
) {
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
        err,
        updatedCampground
    ) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            //redirect show page
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//Destroy Campground route
router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership, function(
    req,
    res
) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;