const { check, validationResult} = require('express-validator');
//Arttu testaa vähä githubbii
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('public'));
app.get('/index.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "index.htm" );
})

// parametrien kirjoitustapa selaimessa : http://localhost:8081/api/showmovie?n=elokuvannimi&y=elokuvanvuosi
app.get('/showmovie', function(req,res){
    console.log('Elokuvan tiedot :)');
    var q = url.parse(req.url, true).query;//movie_name movie_year
    var name = q.n;
    var year = q.y;
})
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
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})