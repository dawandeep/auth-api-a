const router = require('express').Router();
const passport = require('passport');
const { RegisterUser, LoginUser, VerifyToken, GetUser } = require('../controllers/AuthController');


router.post('/register', RegisterUser);
router.post('/isAuthenticated', VerifyToken);
router.post('/login', passport.authenticate('local'), LoginUser);
router.get('/admin/:email',GetUser)
module.exports = router;