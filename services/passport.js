const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const localStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/User');
const configAuth = require('../configs/auth');

// ============= Facebook =========================== //

module.exports = function(passport) {

  // used to serialize the user for the session
  
  // code for login (use('local-login', new LocalStategy))
  // code for signup (use('local-signup', new LocalStategy))
  
  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({
      
      // pull in our app id and secret from our auth.js file
      clientID        : configAuth.facebookAuth.clientID,
      clientSecret    : configAuth.facebookAuth.clientSecret,
      callbackURL     : configAuth.facebookAuth.callbackURL
      
    },
    console.log('tk'),
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        
        // asynchronous
        process.nextTick(function() {
            
            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                return done(err);
                
                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                    console.log(user)
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();
                    
                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    console.log(newUser)
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                        throw err;
                        
                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
                
            });
        });
        
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
};


// // =============  Local strategy ==================== //
// // identify user when login in with credentials
// const loginOptions = { usernameField: 'email'};

// const localLogin = new localStrategy( loginOptions, function(email, password, done) {
//   User.findOne({email: email}, function(err, user) {
//     if (err) {return done(err);}
//     if (!user) { return done(null, false);}

//     user.comparePassword(password, function(err, isMatch){
//       if (err) { return done(err); }

//       //important second argument passed to done has to be false
//       // if you pass a string or object it will return the users token
//       if (!isMatch) { return done(null, false);}
//       done(null, user);
//     });
//   });
// });




// const jwtOptions = {
//   secretOrKey: configAuth.secret,
//   jwtFromRequest: ExtractJwt.fromHeader('authorization')
// };
// console.log(jwtOptions);
// // Create JWT Strategy
// const jwtLogin =
//   new JwtStrategy(
//     jwtOptions,
//     // payload is coming decoded jwt token
//     function(payload, done) {
//       console.log(payload.sub);
//       User.findById(payload.sub, function(err, user) {
//         if (err) {return done(err);}

//         if (user) {
//           done(null, user);
//         } else {
//           done(null, 'Credentials not found');
//         }
//       });
//       // See if user id exists in our database
//       // If it is call done with our user
//       // other wise  call done without
//     }
//   );

//   // Tell passport to use our strategy
//   //
//   passport.use(jwtLogin);
//   passport.use(localLogin);
