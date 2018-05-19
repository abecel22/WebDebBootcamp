const express = require('express');
app = express();
bodyParser = require('body-parser');
mongoose = require('mongoose');
flash = require('connect-flash');
passport = require('passport');
LocalStrategy = require('passport-local');
methodOverride = require('method-override');
Campground = require('./models/campground');
Comment = require('./models/comment');
User = require('./models/user');
seedDB = require('./seeds');

//requiring routes
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

//mongoose.connect('mongodb://localhost/yelp_camp'); //only for testing
mongoose.connect('mongodb://abela:abela22@ds135690.mlab.com:35690/yelpcamp22');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seed the detabase
// seedDB();

app.locals.moment = require('moment');

//Passport configuration
app.use(
    require('express-session')({
        secret: 'Rusty is a dog',
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to call on every route to check for user signed in
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('The YelpCamp Server Has Started!');
});
