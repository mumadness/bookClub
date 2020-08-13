const express = require("express");
const router = express();
const bcrypt = require("bcrypt");
const mongodb = require("./mongodb.js");

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const methodOverride = require('method-override')

const initializePassport = require("./passport_config.js");
initializePassport(
    passport, 
    username => { return mongodb.getCorrectUser(username) }
);

router.use(flash());
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));


router.set('views', __dirname + "/../public/views");
router.set('view engine', 'ejs');

router.get('/', checkAuthenticated, (req, res, next) => {
    res.render('index', { username: req.user.name });
})

// router.post('/', (req, res, next) => {
//     res.render('index');
// })

router.get('/submit_request', checkAuthenticated, (req, res) => {
    res.render('submit_add_request');
})

router.get('/add_book', checkAuthenticated, (req, res) => {
    res.render('add_book');
})

router.get('/add_book_confirm', checkAuthenticated, (req, res) => {
    res.render('add_book_confirm');
})

router.get('/all_books', checkAuthenticated, (req, res) => {
    res.render('all_books');
})

router.get('/recommend_book', checkAuthenticated, (req, res) => {
    res.render('recommend_books');
})

router.get('/book_rec_results', checkAuthenticated, (req, res) => {
    res.render('book_rec_results');
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = {
            name: req.body.username,
            password: hashedPassword
        };

        mongodb.storeData(user, "members")
        res.redirect('/login');
    } catch {
        res.redirect('/register')
    }
})

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}





module.exports = router;