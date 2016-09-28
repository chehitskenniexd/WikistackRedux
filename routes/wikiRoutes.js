var express = require('express');
var wikiRouter = express.Router();
var models = require('../models/models.js')
var Page = models.Page;
var User = models.User;

module.exports = wikiRouter;

wikiRouter.get('/', (req, res, next) => {
    Page.findAll({})
    .then((pages) => {
        pages.forEach((page) => console.log(page.route));
        res.render('index', {
            pages: pages
        })
    })
    .catch(next);
})

wikiRouter.post('/', (req, res, next) => {
    var newPage = Page.build(req.body);
    newPage.save() //asynchronous
        .then(() => res.redirect(newPage.route))
        .catch(err => next(err));
})

wikiRouter.get('/add', (req, res) => {
    res.render('addpage');
})

// This .get MUST FOLLOW /add to prevent the param route 
// from being prioritized vs the /add route
wikiRouter.get('/:urlTitle', (req, res) => {
    var urlTitleOfPage = req.params.urlTitle;
    Page.findOne({
        where: {
            urlTitle: urlTitleOfPage
        }
    })
    .then((pages) => {
        if(!page) { return next(new Error('page was not found!')); }
        res.render('wikipage', {
            page: page
        })
    })
})