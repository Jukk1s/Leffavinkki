//Kirjautuminen - rekisteröityminen

module.exports = function(app, cors, url, query, dotenv,jwt, bodyParser) {
    dotenv.config();
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json('application/json'));
    app.use(cors({credentials: true, origin: true}));

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

    app.get('/user',cors(),(req,res) => {
        var q = url.parse(req.url, true).query;
        const userID = q.id;
        var sql = "SELECT * FROM users WHERE id = ?";
        var string;
        if(!userID)
            res.send("Käyttäjän id ei ole validi.");
        else
        (async () => {
            try {
                const rows = await query(sql, [userID]);
                sql = "SELECT * FROM profiles WHERE id = ?"
                const rows2 = await query(sql, [userID]);

                //const obj1 = JSON.parse(rows[0]);
                //const obj2 = JSON.parse(rows2[0]);
                console.log(rows[0]);
                let mergedObject = [];
                mergedObject.push(rows[0]);
                mergedObject.push(rows2[0]);
                console.log("----"+JSON.stringify(mergedObject));
                //console.log(JSON.stringify(mergedObject));
                string = JSON.stringify(mergedObject);
                res.send(string);
            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })();
    })

//http://localhost:8081/users/register?name=nimi&password=salasana&email=sähköposti
//http://localhost:8081/users/register?name=&password=&email=
    app.post('/users/register', (req,res) => {
        var q = url.parse(req.url, true).query;
        const user = { name: q.name, email: q.email, password: q.password };
        const name = user.name;
        const password = user.password;
        const email = user.email;
        var sql = "SELECT * FROM users WHERE name = ? OR email = ?";
        var string;
        if(!name || !password || !email)
            res.send("Nimi, sähköposti tai salasana kenttä ei ole validi.")
        else
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

    //http://localhost:8081/users/login?email=&password=
    app.post('/users/login',cors(), (req, res) => {
        /*
        var q = url.parse(req.url, true).query;
        const user = { email: q.email, password: q.password };
        const email = user.email;
        const password = user.password;
        */
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;
        var sql = "SELECT * FROM users WHERE email = ? AND password = SHA1(?)";
        var string;
        if(!email || !password)
            res.send("Sähköposti tai salasana ei ole määritetty.");
        else
        (async () => {
            try {
                const rows = await query(sql, [email, password]);

                string = JSON.stringify(rows);
                if(rows.length > 0){
                    console.log("User logged in with id "+rows[0].id);
                    //Tehdään token
                    const token = jwt.sign({id: rows[0].id}, process.env.TOKEN_SECRET);
                    res.header('auth-token', token).send(token);
                } else {
                    res.send("Email and password don't match");
                    string = JSON.stringify(rows);
                    console.log(string);
                    res.send("Email and password don't match");
                }
            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })();
    })
}