const apiUrl = "http://www.omdbapi.com/?r=json&type=movie&";

const verify = require('./verifyToken');
const readToken = require('./readToken');

//Käytetään arraytä, sillä rajapinta rajoittaa 1000-hakemusta
//per päivä/avain niin on helppo implementoida jos avain vaihtuisi
//päivän aikana
const apiKeys = ["&apikey=bfbd237f"];

module.exports = function(app, cors, url, query, fetch, bodyParser) {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json('application/json'));
    app.use(cors({credentials: true, origin: true}));


    app.post('/movies/addcomment', verify, (req, res) => {
        console.log(readToken.readId(req.header('auth-token')));
        console.log(req);

        let commentHeader = req.body.header;
        let comment = req.body.content;
        let movieId = req.body.movieId;
        let userId = req.user.id;
        let rating = 3; // Muokataan myöhemmin tämä kuntoon

        try {
            (async () => {
                let sql = "SELECT * FROM reviews WHERE users_id = ? AND movie_id = ?";
                const rows = await query(sql, [userId, movieId]);

                if (rows.length > 0) {
                    let sql2 = "UPDATE reviews SET review = ? WHERE users_id = ? AND movie_id = ?";
                    await query(sql2, [rating, userId, movieId]);
                } else {
                    let sql3 = "INSERT INTO reviews (users_id, movie_id, review) VALUES (?, ?, ?)";
                    await query(sql3, [userId, movieId, rating]);
                }

                let sql4 = "INSERT INTO comments (users_id, movie_id, header, comment) VALUES (?, ?, ?, ?)";
                const rows4 = await query(sql4, [userId, movieId, commentHeader, comment]);
                let string = JSON.stringify(rows4);

                res.send(string);

            })()

        } catch (err) {
            console.log("Database error! " + err);
        }

    })

    app.get('/movies', cors(), function (req, res) {

        var q = url.parse(req.url, true).query;
        let pagecount = 1;
        let parameters = "";
        let paramCount = 0;
        let separators = 0;

        //Katsotaan lähetetyt parametrit ja lisätään ne muuttujaan
        if ('s' in q) {
            //Jos on jo parametri eikä välissä ole & merkkiä
            if (paramCount > separators) {
                separators++;
                parameters += "&";
            }

            parameters += "s=" + q.s;
            paramCount++;
        }
        if ('y' in q) {
            //Jos on jo parametri eikä välissä ole & merkkiä
            if (paramCount > separators) {
                separators++;
                parameters += "&";
            }

            parameters += "y=" + q.y;
            paramCount++;
        }
        if ('i' in q) {
            //Jos on jo parametri eikä välissä ole & merkkiä
            if (paramCount > separators) {
                separators++;
                parameters += "&";
            }

            parameters += "i=" + q.i;
            paramCount++;
        }
        if ('plot' in q) {
            //Jos on jo parametri eikä välissä ole & merkkiä
            if (paramCount > separators) {
                separators++;
                parameters += "&";
            }

            parameters += "plot=" + q.plot;
            paramCount++;
        }
        if ('page' in q) {
            if (q.page > 1) {
                pagecount = q.page;
                if (pagecount > 3)
                    pagecount = 3;
            }
        }
        if (paramCount > 0 && pagecount > 1) {
            const page = "&page=";
            (async () => {
                console.log("Search request: " + apiUrl + parameters + apiKeys[0] + " pages " + pagecount);
                try {
                    //Etistään ensiksi yhden sivun verran elokuva "10" (page=1)
                    let movies = await fetch(apiUrl + parameters + page + "1" + apiKeys[0]);
                    let jsonResponse = await movies.json();

                    //Tämän jälkeen lisätään vielä niin monta sivua elokuva kuin kysytään (max 3)
                    for (let i = 2; i <= pagecount; i++) {
                        let response = await fetch(apiUrl + parameters + page + i + apiKeys[0]);
                        let reponseJSON = await response.json();
                        for (let i = 0; i < Object.keys(reponseJSON.Search).length; i++) {
                            jsonResponse.Search.push(reponseJSON.Search[i]);
                        }
                    }
                    if (movies) {
                        res.json(jsonResponse);
                    }
                } catch (error) {
                    console.log(error);
                }
            })();
        } else if (paramCount > 0) {
            (async () => {
                console.log("Search request: " + apiUrl + parameters + apiKeys[0]);
                try {
                    const response = await fetch(apiUrl + parameters + apiKeys[0]);
                    if (response) {
                        const jsonResponse = await response.json();
                        res.json(jsonResponse);
                    }
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    });

    //Palauttaa kaikki tietyn elokuvan kommentit
    //showcomments?id=elokuvanid
    app.get('/showcomments', cors(), (req,res)=>{
        let q = url.parse(req.url, true).query;
        const movieId = q.id;
        let sql;
        sql = "SELECT * FROM comments WHERE movie_id = ?";

        (async () => {
            try {
                const commentRows = await query(sql, [movieId]);

                var returnArray = [];

                //Käydään läpi jokaisen kommentin käyttäjä-id
                //ja lisätään palautettavaan JSONiin jokaista id:tä vastaava käyttäjänimi
                for(var i = 0; i < commentRows.length; i++){

                    if(commentRows[i].hasOwnProperty('movie_id')) {
                        for (let j = 0; j < commentRows.length; j++) {

                            let userId = commentRows[i].users_id;
                            sql = "SELECT name FROM users WHERE id = ?";
                            const nameRow = await query(sql, [userId]);
                            let name = nameRow[0].name;
                            commentRows[j].name = name; //Tällä lisätään uusi sarake JSONiin

                            returnArray.push(commentRows[j]);
                        }

                        /*

                        const rows2 = await query(sql, rows[i].users_id);
                        for(var l = 0; l < rows2.length; l++){
                            returnArray.push(rows2[l]);
                        }  /*

                        /*
                        if(JSON.stringify(returnArray) === "{}")
                            returnArray = rows2;
                        else
                            returnArray.push(rows2);

                         */

                     //   string = JSON.stringify(rows2);
                    //    console.log(string);
                    }
                }

                console.log(returnArray);
                res.json(returnArray);

            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })();
    })

    //Palauttaa kaikki tietyn käyttäjän kirjoittamat kommentit
    //usercomments?id=käyttäjänid
    app.get('/usercomments', cors(), (req,res)=>{
        var q = url.parse(req.url, true).query;
        const profileId = q.id;
        console.log('Searching for profile with id: '+profileId);

        var string;
        (async () => {
            try {
                let sql = "SELECT * FROM comments WHERE users_id = ? ORDER by movie_id";
                let returnArray = [];
                const rows = await query(sql, [profileId]);

                for (let i = 0; i < rows.length; i++) {
                    returnArray.push(rows[i]);
                }
                string = JSON.stringify(returnArray);
             //   console.log(string);
                res.json(returnArray);


                /*

                for(var i = 0; i < rows.length; i++){
                    if(rows[i].hasOwnProperty('id')) {
                        const rows2 = await query(sql, profileId);
                        for(var l = 0; l < rows2.length; l++){
                            returnArray.push(rows2[l]);
                        }

                        /*
                        if(JSON.stringify(returnArray) === "{}")
                            returnArray = rows2;
                        else
                            returnArray.push(rows2);

                         */

/*
                        string = JSON.stringify(rows2);
                        //console.log(string);
                    }
                }
                res.json(returnArray, rows);
*/
            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })();
    })

    //Palauttaa kaikki käyttäjän antamat arvostelut ilman kommentteja
    //userreviews?id=käyttäjänid
    app.get('/userreviews', cors(), (req, res) => {
        let q = url.parse(req.url, true).query;
        let userId = q.id;
        let sql = "SELECT review, movie_id FROM reviews WHERE users_id = ?";
        let returnArray = [];

        (async () => {
            try {
                const rows = await query(sql, [userId]);
                for (let i = 0; i < rows.length; i++) {
                    returnArray.push(rows[i]);
                }
                res.json(returnArray);

            } catch (error) {
                console.log(error);
            }
        })();
    })

    //Jotta saadaan kommentin kirjoittajan nimimerkki näkyviin
    //getusername/?id=käyttäjänid
    app.get('/getusername', cors(), (req, res) => {
        let q = url.parse(req.url, true).query;
        let userId = q.id;
        let sql = "SELECT name FROM users WHERE id = ?";

        (async () => {
            try {
                const name = await query(sql, [userId]);
                res.json(name);

            } catch (err) {
                console.log(err);
            }
        })();
    })
}