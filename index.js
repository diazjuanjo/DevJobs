const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('./config/passport');

require('dotenv').config({path : 'variables.env'});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// validacion de campos
// app.use(expressValidator());

// habilitar handlebars como view
app.engine('handlebars',
    exphbs({
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);
app.set('view engine', 'handlebars');

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE
    })
}));

// inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Alertas y flash messages
app.use(flash());

// Crear nuestro middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
})

app.use('/', router());

app.listen(process.env.PUERTO);