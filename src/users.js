//Kirjautuminen - rekisteröityminen

module.exports = function(app, cors, url, query) {

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
}