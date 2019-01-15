/**
 * Created on 29/05/2018.
 */

'use strict';

module.exports = function ( applicationConfig ) {

    let express = require('express');
    let router = express.Router();
    let debug = require('debug')('nodejs-express-handlebars-boilerplate:routing');

    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Home', version: applicationConfig.version });
    });

    return router;

};