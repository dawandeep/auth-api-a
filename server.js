const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const dbstore = require('connect-mongodb-session')(session);
const cors = require('cors');
const UserModel = require('./models/UserModel');
const routes = require('./routes/UserRoute');
const repo = require('./repository/UserRepository');
const app = express();
const DB_URI = "mongodb+srv://mflix:3Rkg4pkY7rprsDjE@cluster0.v3uapxa.mongodb.net/AuthDB";
// const DB_URI = process.env.MONGODB_SERVER;
const store = new dbstore({
    uri: DB_URI,
    collection: 'app-sessions'
});

mongoose.connect(DB_URI);
mongoose.connection.once('open', (err) => {
    if (!err) {
        console.log('Connected to DB');
    }
});

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({
    secret: 'this is my secret',
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    },
    store: store,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(repo.LoginUser());
app.use('/api/v1/auth', routes);

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    });
});


const port = process.env.PORT || 7000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});