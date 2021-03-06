module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('caloriecount').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

//  Calories Saved Page ===================================================================
app.get('/userinfo', isLoggedIn, function(req, res) {
    db.collection('caloriecount').find().toArray((err, result) => {
      console.log("User Info", result)
      if (err) return console.log(err)
      res.render('userinfo.ejs', {
        user : req.user,
        ingredients: result
      })
    })
});

app.post('/saveinfo', (req, res) => {
  db.collection('savedFood').save({message: req.body.msg,funds:req.body.fnd,}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// message board routes ===============================================================

    app.post('/userInput', (req,res) => {
      console.log("called",req.body)
      db.collection('caloriecount').save(
        {
        submittedList: req.body.submittedList,
        date: new Date()
      },
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/userinfo')
      })
    })




    app.put('/userInput', (req, res) => {
      db.collection('caloriecount')
      .findOneAndUpdate({name: req.body.foodInsert, foodCal: req.body.foodCal}, {
        $set: {
          name: req.body.foodInsert,
           foodCal: req.body.foodCal
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.put('/decrease', (req, res) => {
      db.collection('caloriecount')
      .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
        $set: {
          thumbUp:req.body.thumbDown - 1 //?
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/messages', (req, res) => {
      db.collection('caloriecount').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
