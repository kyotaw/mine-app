'use strict';

const express = require('express')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , passport = require('passport')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs')
  , env = require('./env')
  , ip = require('./helpers/ip')
  , db = require('./infrastructures/db')
  , cors = require('./middlewares/cors.js')
  , decodeQuery = require('./middlewares/query_decoder.js').decodeQuery
  , routes_api = require('./routes_api')
  , routes_site = require('./routes_site');

async function start() {
	var app = express();
    app.use(cors);
    app.use(passport.initialize());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
    app.use(decodeQuery);

    // site
    app.use(cookieParser());
    app.set('views', path.join(path.resolve(''), 'public/frontend/dist'));
    app.set('view engine', 'html');
    app.engine('html', ejs.renderFile);
    app.use('/static', express.static(path.join(path.resolve(''), 'public')));

    // routing
    app.use(routes_api());
    app.use(routes_site());
    const server = http.createServer(app);

    await db.start();
    server.listen(env.APISERVER_PORT, () => {
	    console.log('Kairai server is working');
    });
}

module.exports = {
    start: start
}
