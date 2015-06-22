'use strict';

// CREATE HTTP SERVER AND PROXY

var app = require('express')();

app.use(require('morgan')('dev'));

// LOAD CONFIGURATION

app.set('port', process.env.PORT || 8000);

// CONFIGURE /APP/* ROUTES

app.use('/soi/app',   require('serve-static')(__dirname + '/app_build'));
app.use('/soi/app',   require('serve-static')(__dirname + '/app'));
app.all('/soi/app/*', function(req, res) { res.status(404).send(); } );

// CONFIGURE /API/* ROUTES (proxy)

var proxy = require('http-proxy').createProxyServer({});

app.all('/api/*', function(req, res) { proxy.web(req, res, { target: 'https://api.cbd.int:443', secure: false } ); } );

// CONFIGURE TEMPLATE.HTML

app.get('/soi',   function (req, res) { res.sendfile(__dirname + '/app/template.html'); });
app.get('/soi/*', function (req, res) { res.sendfile(__dirname + '/app/template.html'); });

// START SERVER

app.listen(app.get('port'), function () {
	console.log('Server listening on %j', this.address());
});

// LOG PROXY ERROR & RETURN error 500

proxy.on('error', function (e, req, res) {
    console.error('error proxying: '+req.url);
    console.error('proxy error:', e);
    res.send( { code: 500, source:'chm/proxy', message : 'proxy error', proxyError: e }, 500);
});
