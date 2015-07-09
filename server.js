'use strict';

// CREATE HTTP SERVER AND PROXY

var app = require('express')();

app.use(require('morgan')('dev'));

// LOAD CONFIGURATION

app.set('port', process.env.PORT || 2000);

// CONFIGURE /APP/* ROUTES

app.use('/soi/app',   require('serve-static')(__dirname + '/app_build'));
app.use('/soi/app',   require('serve-static')(__dirname + '/app'));
app.all('/soi/app/*', function(req, res) { res.status(404).send(); } );

// CONFIGURE TEMPLATE.HTML

app.get('/soi',   function (req, res) { res.sendfile(__dirname + '/app/template.html'); });
app.get('/soi/*', function (req, res) { res.sendfile(__dirname + '/app/template.html'); });

// START SERVER

app.listen(app.get('port'), function () {
	console.log('Server listening on %j', this.address());
});
