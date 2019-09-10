var express               = require('express'),
    passport              = require('passport'),
    bodyParser            = require('body-parser'),
    User                  = require('./models/user'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    mongoose              = require('mongoose');1

mongoose.connect('mongodb://localhost:27017/auth_demo_app');

var app = express();

//------- General configuration -------//
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
//------- General configuration -------//

//------- Setup passport.js -------//
app.use(require('express-session')({
    secret: "This is the authentication demo app",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//------- Setup passport.js -------//

// ROUTES
//==================================================

// Home ROUTE
app.get('/', function(req, res){
    res.render('home');
})
// Secret ROUTE
app.get('/secret', isLoggedIn, function(req, res){
    res.render('secret');
})

// Auth ROUTES
// show sign up form
app.get('/register', function(req, res){
    res.render('register');
})
// handling user sign up
app.post('/register', function(req, res){
    // console.log(req.body.username);
    // console.log(req.body.password);
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register')
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/secret')
        });
    })
})

// Login ROUTES
// render login form
app.get('/login', function(req, res){
    res.render('login')
})
// handling user login
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), function(req, res){
})

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// Server running
app.listen(3000, function(){
    console.log('server is running at PORT3000...');
})