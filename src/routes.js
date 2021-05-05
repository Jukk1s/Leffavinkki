//Serverin reitit

module.exports = function(app, cors) {

    app.get('/index.htm',cors(), function (req, res) {
        res.writeHead(301,
            {Location: '/'}
        );
        res.end();
    });
    app.get('/index.html',cors(), function (req, res) {
        res.writeHead(301,
            {Location: '/'}
        );
        res.end();
    });
    app.get('/index',cors(), function (req, res) {
        res.writeHead(301,
            {Location: '/'}
        );
        res.end();
    });
    app.get('/',cors(), function (req, res) {
        res.sendFile( __dirname + "/views/" + "index.html" );
    });
    app.get('/home',cors(), function (req, res) {
        res.writeHead(301,
            {Location: '/'}
        );
        res.end();
    });

    app.get('/credits.html',cors(), function (req, res) {
        res.writeHead(301,
            {Location: '/credits'}
        );
        res.end();
    });
    app.get('/credits',cors(), function (req, res) {
        res.sendFile( __dirname + "/views/" + "credits.html" );
    });


    app.get('/movie.html',cors(), function (req, res) {
        res.sendFile( __dirname + "/views/" + "movie.html" );
    });
    app.get('/movie',cors(), function (req, res) {
        res.sendFile( __dirname + "/views/" + "movie.html" );
    });


    app.get('/login.html',cors(), function (req, res) {
        res.writeHead(301,
            {Location: '/login'}
        );
        res.end();
    });
    app.get('/login',cors(), function (req, res) {
        res.sendFile( __dirname + "/views/" + "login.html" );
    });


    app.get('/profile.html',cors(), function (req, res) {
        res.writeHead(301,
            {Location: '/profile'}
        );
        res.end();
    });
    app.get('/profile',cors(), function (req, res) {
        res.sendFile( __dirname + "/views/" + "profile.html" );
    });


    app.get('/register.html',cors(), function (req, res) {
        res.writeHead(301,
            {Location: '/register'}
        );
        res.end();
    });
    app.get('/register',cors(), function (req, res) {
        res.sendFile( __dirname + "/views/" + "register.html" );
    });


    app.get('/navbar.html',cors(), function (req, res) {
        res.writeHead(301,
            {Location: '/navbar'}
        );
        res.end();
    });
    app.get('/navbar',cors(), function (req, res) {
        res.sendFile( __dirname + "/views/" + "navbar.html" );
    });
}