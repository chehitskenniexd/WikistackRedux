// add all the require modules/files
var morgan = require('morgan');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var sequelize = require('sequelize');
var express = require('express');
var wikiRoutes = require('./routes/wikiRoutes.js');
var models = require('./models/models.js');
var socketio = require('socket.io');
var Page = models.Page;
var User = models.User;

//initialize the app
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });
app.use('/wiki', wikiRoutes);
app.use('/static', express.static('public'));

var server = app.listen(3000);

//Error Checking
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send(err.message);
    // end error checking
});
app.get('/', (req, res) => res.render('index'))

// Synchronize the models(db)
Page.sync()
    .then(() => User.sync())
    .then(() => {
        socketio.listen(server, () =>
            console.log('Server is listening on port 3000!')
        );
    })
    .catch(console.error);