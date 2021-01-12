require('dotenv').config();

var express = require('express');
var passport = require('passport');
var SwoopStrategy = require('passport-swoop').Strategy;

var trustProxy = false;
if (process.env.DYNO) {
  // Apps on heroku are behind a trusted proxy
  trustProxy = true;
}


// Configure the Swoop strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// the user's profile (email and id).  The function must invoke `cb` with a user
// object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new SwoopStrategy({
    clientID: process.env['SWOOP_CLIENT_ID'],
    clientSecret: process.env['SWOOP_CLIENT_SECRET'],
    callbackURL: 'http://localhost:8080/auth/swoop/callback',
    proxy: trustProxy
  },
  function(profile, cb) {
    // In this example, the user's email is supplied as the user
    // record.  In a production-quality application, the Swoop email/id should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Swoop profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    console.log('ENV');
    console.log(process.env);
    console.log('Headers:');
    console.log(req.headers)
    res.render('login');
  });

app.get('/auth/swoop',
  passport.authenticate('swoop'));

app.get('/auth/swoop/callback',
  passport.authenticate('swoop', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.get('/logout',
  function(req, res){
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });

app.listen(process.env['PORT'] || 8080);
