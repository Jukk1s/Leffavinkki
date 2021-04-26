module.exports = function(app, cors) {
    app.post('/showmovie',cors(), function(req,res){

        console.log('Elokuvan tiedot '+req.body);

        //VANHOJA IDEOITA: EI TARVITSE HUOMIOIDA
        // parametrien kirjoitustapa selaimessa : http://localhost:8081/showmovie?n=elokuvannimi&y=elokuvanvuosi
        //var q = url.parse(req.url, true).query;//movie_name movie_year
        //var name = q.n;
        //var year = q.y;

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
}