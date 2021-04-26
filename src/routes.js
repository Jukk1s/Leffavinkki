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
}