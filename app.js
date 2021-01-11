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
//var mysql = require('mysql');
//const multer = require('multer');

//Set storage engine
const storage = multer.diskStorage({
    destination: './public/imageUploads',
    filename: function(req, file, cb){
        /*First should come an error thus we pass null, next is the name of the file. We do not want the original file name in order not to stump on the dublicate file names issue.
        A easy way to solve this issue is the time stamp method. filedname refers to the image input filed name from the html file + present date + file extension .jpg .png etc.
        */
        cb(null, file.fieldname +  '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    //storage is the storage var we defined above
    limits:{fileSize: 1000000}, //file size limit in bytes.
    fileFilter: function(req, file, cb){
        //This is a custom function.
        checkFileType(file, cb);
    }
}).single('myImage'); 
/* Since we upload single files we use single() but wwe could also used [] in case of multiple files upload. 
myName is the name of the input tag from image upload tag element - <input name="muName" type="file">. */

function checkFileType(file, cb){
    //27:59
}

//SQL DB credentials
/*var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password"
  });*/

//load models
//require('./models/Test');

//Passport config
require('./config/passport')(passport);

//Load routes (link them)
const index = require('./routes/index');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
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

//Nodejs MySQL resource: https://www.w3schools.com/nodejs/nodejs_mysql.asp
//MySQL connect
/*con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
});*/

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
//путь, переданный в функцию express.static, указан относительно каталога, из которого запускается процесс node. 
//В случае запуска приложения Express из другого каталога, безопаснее использовать абсолютный путь к каталогу для предоставления файлов.
app.use(express.static(path.join(__dirname, 'public')));

//Use routes
app.use('/', index); //everything that addresses '/auth' will be redirected to 'auth' var
app.use('/auth', auth);
app.use('/admin', admin);
// admin refers to the const we created higher in the text.
// You can also write the above line like this "app.use(adminBro.options.rootPath, router);"
// It is the same thing.
//app.use('/tests', tests);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});