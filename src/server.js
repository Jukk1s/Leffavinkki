const { check, validationResult} = require('express-validator');

var express = require('express');

var app = express();

var url = require('url');

var bodyParser = require('body-parser');

var cors = require('cors');

var path = require('path');

var http = require('http');

var util = require('util');

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


const query = util.promisify(conn.query).bind(conn);

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app, cors);
require('./users')(app, cors, url, query);
require('./movies')(app,cors, url, query);

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