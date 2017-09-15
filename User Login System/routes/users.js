var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
  dest: './uploads'
});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register', {
    title: 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        console.log('Unknown User');
        return done(null, false, {
          message: 'Unknown User'
        });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          console.log('Invalid Password');
          return done(null, false, {
            message: 'Invalid Password'
          });
        }
      });
    });
  }
));
router.post('/register', upload.single('profileimage'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  // Check for image field
  if (req.file) {
    console.log('Uploading file...');
    var profileimage = req.file.filename;

    // // File info (gets the filename)
    // var profileImageOriginalName = req.files.profileimage.originalname;
    // var profileImageName = req.files.profileimage.name;
    // var profileImageMimeType = req.files.profileimage.mimetype;
    // var profileImagePath = req.files.profileimage.path;
    // var profileImageExt = req.files.profileimage.extension;
    // var profileImageSize = req.files.profileimage.size;
  } else {
    // Set a default image
    var profileimage = 'noimage.png';
  }

  // Form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Not a valid email').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Checks for errors
  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors,
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    });

    // Create user
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
      console.log(user);
    });
    // Success message
    req.flash('success', 'You are now registered and may now log in.');

    res.location('/');
    res.redirect('/');
  }
});


router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: 'Invalid username or password'
}), function(req, res) {
  console.log('Authentication Successful');
  req.flash('success', 'You are logged in');
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/users/login');
});
module.exports = router;
