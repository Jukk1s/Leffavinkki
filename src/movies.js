const apiUrl = "http://www.omdbapi.com/?r=json&";

const verify = require('./verifyToken');
const readToken = require('./readToken');

//Käytetään arraytä, sillä rajapinta rajoittaa 1000-hakemusta
//per päivä/avain niin on helppo implementoida jos avain vaihtuisi
//päivän aikana
const apiKeys = ["&apikey=bfbd237f"];

module.exports = function(app, cors, url, query, fetch, bodyParser) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json('application/json'));
    app.use(cors({credentials: true, origin: true}));

    app.post('/movies/addcomment', verify, (req, res) => {
        console.log(readToken.readId(req.header('auth-token')));
        console.log(req.body.movieId);
        res.send('Hello there');
    })

    app.get('/movies', cors(), function(req,res){

        var q = url.parse(req.url, true).query;
        let parameters = "";
        let paramCount = 0;
        let separators = 0;

        //Katsotaan lähetetyt parametrit ja lisätään ne muuttujaan
        if('s' in q){
            //Jos on jo parametri eikä välissä ole & merkkiä
            if(paramCount>separators){
                separators++;parameters+="&";}

            parameters += "s="+q.s;
            paramCount++;
        }
        if('y' in q){
            //Jos on jo parametri eikä välissä ole & merkkiä
            if(paramCount>separators){
                separators++;parameters+="&";}

            parameters += "y="+q.y;
            paramCount++;
        }
        if('i' in q){
            //Jos on jo parametri eikä välissä ole & merkkiä
            if(paramCount>separators){
                separators++;parameters+="&";}

            parameters += "i="+q.i;
            paramCount++;
        }
        if('plot' in q){
            //Jos on jo parametri eikä välissä ole & merkkiä
            if(paramCount>separators){
                separators++;parameters+="&";}

            parameters += "plot="+q.plot;
            paramCount++;
        }

        if(paramCount>0){
            (async () => {
                console.log("Search request: " + apiUrl+parameters+apiKeys[0]);
                try{
                    const response = await fetch(apiUrl+parameters+apiKeys[0]);
                    if(response){
                        const jsonResponse = await response.json();
                        res.json(jsonResponse);
                    }
                }catch(error){
                    console.log(error);
                }
            })();
        }

    });

    //showcomments?id=elokuvanid
    app.get('/showcomments', cors(), (req,res)=>{
        var q = url.parse(req.url, true).query;
        const movieId = q.id;
        var sql = "SELECT * FROM reviews WHERE movie_id = ?";
        var string;
        (async () => {
            try {
                const rows = await query(sql, [movieId]);

                string = JSON.stringify(rows);

                sql = "SELECT * FROM comments WHERE reviews_id = ?";

                var returnArray = [];

                //console.log(string);
                for(var i = 0; i < rows.length; i++){
                    if(rows[i].hasOwnProperty('id')) {
                        const rows2 = await query(sql, rows[i].id);
                        for(var l = 0; l < rows2.length; l++){
                            returnArray.push(rows2[l]);
                        }

                        /*
                        if(JSON.stringify(returnArray) === "{}")
                            returnArray = rows2;
                        else
                            returnArray.push(rows2);

                         */
                        string = JSON.stringify(rows2);
                        //console.log(string);
                    }
                }
                res.json(returnArray);

            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })();
    })

    app.get('/usercomments', cors(), (req,res)=>{
        var q = url.parse(req.url, true).query;
        const profileId = q.id;
        console.log('Searching for profile with id: '+profileId);
        var sql = "SELECT * FROM reviews WHERE users_id = ?";
        var string;
        (async () => {
            try {
                const rows = await query(sql, [profileId]);

                string = JSON.stringify(rows);

                sql = "SELECT * FROM comments WHERE reviews_id = ?";

                var returnArray = [];

                //console.log(string);
                for(var i = 0; i < rows.length; i++){
                    if(rows[i].hasOwnProperty('id')) {
                        const rows2 = await query(sql, rows[i].id);
                        for(var l = 0; l < rows2.length; l++){
                            returnArray.push(rows2[l]);
                        }

                        /*
                        if(JSON.stringify(returnArray) === "{}")
                            returnArray = rows2;
                        else
                            returnArray.push(rows2);

                         */
                        string = JSON.stringify(rows2);
                        //console.log(string);
                    }
                }
                res.json(returnArray);

            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })();
    })
}