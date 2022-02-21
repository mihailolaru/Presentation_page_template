const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
//const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//load models
//require('./models/Test');

//Passport config
require('./config/passport')(passport);

//Load routes (link them)
const index = require('./routes/index');
const auth = require('./routes/auth');
//const tests = require('./routes/tests');

//load keys
const keys = require('./config/keys');

//HB helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs');

// Mongoose connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const app = express();

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));

// express-session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

//Global vars
app.use(function(req, res, next) {
    res.locals.succes_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Hablebars middleware 
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

//app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

//Passport middleware. It is important to place this after the express session middleware!!!
app.use(passport.initialize());
app.use(passport.session());

//set global vars
app.use((req, res, next) => {
    res.locals.test = req.test || null;
    next();
});

//Set static folder __dirname refers to the current directory
app.use(express.static(path.join(__dirname, 'public')));

//Use routes
app.use('/', index); //everything that addresses '/auth' will be redirected to 'auth' var
app.use('/auth', auth);

// admin refers to the const we created higher in the text.
// You can also write the above line like this "app.use(adminBro.options.rootPath, router);"
// It is the same thing.
//app.use('/tests', tests);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});