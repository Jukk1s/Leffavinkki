const { check, validationResult} = require('express-validator');

var express = require('express');

var app = express();

var url = require('url');

var bodyParser = require('body-parser');

var cors = require('cors');

var path = require('path');

app.use(cors());

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const mysql = require('mysql');
const isLocalhost = true;
var conn = mysql;

//Koitetaan ottaa yhteyttä muuttujan "isLocalhost" mukaan
if(isLocalhost){
    conn = mysql.createConnection({
        host: "localhost",
        user: "client",
        password: "client",
        database: "web_projekti"
    });
} else {
    conn = mysql.createConnection({
        host: '//mysql.metropolia.fi/eljash',
        user: 'eljash',
        password:'r3dDevil',
        database: 'eljash'});
}

conn.connect(function(err){
    if (err) throw err;
    console.log("Connected to MySQL");
});

var util = require('util');
const query = util.promisify(conn.query).bind(conn);

app.get('/users', cors(), (req, res) => {
    var sql = "SELECT * FROM users";
    var string;
    (async () => {
        try {
            const rows = await query(sql);
            console.log(rows);
            string = JSON.stringify(rows);
            console.log(string);
            res.send(string);
        }
        catch (err){
            console.log("Database error!"+err);
        }
        finally {

        }
    })()
});

//http://localhost:8081/users/new?name=nimi&password=salasana&email=sähköposti
//http://localhost:8081/users/new?name=&password=&email=
app.post('/users/new', cors(), (req,res) => {
    var q = url.parse(req.url, true).query;
    const user = { name: q.name, email: q.email, password: q.password };
    const name = user.name;
    const password = user.password;
    const email = user.email;
    var sql = "SELECT * FROM users WHERE name = ? OR email = ?";
    var string;
    (async () => {
        try {
            const rows = await query(sql, [name, email]);

            string = JSON.stringify(rows);
            if(rows.length > 0){
                res.send("User '"+ name +"' or email '"+email+"' is already in use");
            } else {

                sql = "INSERT INTO users (name, email, password) "
                + "VALUES (?, ?, SHA1(?))"

                console.log(name+" "+email+" "+password);

                const rows2 = await query(sql, [name, email, password]);
                string = JSON.stringify(rows2);
                console.log(string);
                const newUserId = rows2.insertId;
                console.log("id: "+newUserId);
                sql = "INSERT INTO profiles (id) "
                + "VALUES (?)"
                const rows3 = await query(sql, [newUserId]);
                res.send(string);
            }
        }
        catch (err){
            console.log("Database error!"+err);
        }
        finally {

        }
    })();
});

app.post('/users/login',cors(), async (req, res) => {
    const user = "";
})

app.post('/showmovie',cors(), function(req,res){

    console.log('Elokuvan tiedot '+req.body);


    //VANHOJA IDEOITA: EI TARVITSE HUOMIOIDA
    // parametrien kirjoitustapa selaimessa : http://localhost:8081/showmovie?n=elokuvannimi&y=elokuvanvuosi
    //var q = url.parse(req.url, true).query;//movie_name movie_year
    //var name = q.n;
    //var year = q.y;

});
/*app.post('/process_post', urlencodedParser,
    [check('first_name').isLength({ min: 2 }).withMessage("vähintään kaksi merkkiä!"),
        check('last_name').isLength({ min: 2 }).withMessage("vähintään kaksi merkkiä!"),
        check('email').isEmail().withMessage("sähköposti on väärän muotoinen!"),
        check('age').isNumeric().withMessage("ikä tulee olla numeerinen!")],
    function (req, res) {

        //Ilmoitetaan jos virheellistä syöttöä
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        // Prepare output in JSON format
        response = {
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email:req.body.email,
            age:req.body.age
        };
        console.log(response);
        res.end(JSON.stringify(response));
    })*/

/* ------------------------------- */
/* ------------------------------- */
/* --           URLIT           -- */
/* ------------------------------- */
/* ------------------------------- */

app.use(express.static(path.join(__dirname, 'public')));

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

/* SERVER */

var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.get('/', function(req, res) {
    console.log("Cookies: ", req.cookies);
    res.send('TESTI');
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});