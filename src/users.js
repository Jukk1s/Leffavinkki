//Kirjautuminen - rekisteröityminen

const verify = require('./verifyToken');
const readToken = require('./readToken');

module.exports = function(app, cors, url, query, dotenv,jwt, bodyParser) {
    dotenv.config();
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json('application/json'));
    app.use(cors({credentials: true, origin: true}));

    /*
    //Funktio korjaa profiilien arvostelu luvun oikeaksi.
    app.get('/users/setreviews', cors(), (req, res) => {
        var sql = "SELECT * FROM users";
        var string;
        (async () => {
            try {
                const rows = await query(sql);
                if(rows.length > 0){
                    for(let i = 0; i < rows.length; i++){
                        if(rows[i].id){
                            sql = "SELECT * FROM reviews WHERE users_id = ?";
                            const rows2 = await query(sql,[rows[i].id]);
                            sql = "UPDATE profiles SET reviews = ? WHERE id = ?";
                            const rows3 = await query(sql,[rows2.length,rows[i].id]);
                        }
                    }
                }
                string = JSON.stringify(rows);
                res.send("Arvostelujen luvut korjattu.");
            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })()
    });
     */

    app.get('/users', verify, (req, res) => {
        res.header('user-id', req.user.id).send();
    });

    //Palauttaa kaikkien käyttäjien nimet
    app.get('/users', cors(), (req, res) => {
        var sql = "SELECT DISTINCT id, name FROM users";
        var string;
        (async () => {
            try {
                const rows = await query(sql);
                string = JSON.stringify(rows);
                res.send(string);
            }
            catch (err){
                console.log("Database error!"+err);
            }
            finally {

            }
        })()
    });

    //Ottaa parametrina käyttäjän id:n tyyliin: /user?id=1
    //ja palauttaa
    app.get('/user',cors(),(req,res) => {
        var q = url.parse(req.url, true).query;
        const userID = q.id;
        var sql = "SELECT id, status, name FROM users WHERE id = ?";
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
                //console.log(rows[0]);
                let mergedObject = [];
                mergedObject.push(rows[0]);
                mergedObject.push(rows2[0]);
                //console.log("----"+JSON.stringify(mergedObject));
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

    app.post('/users/edit', verify, (req,res) => {

        let description = req.body.description;

        if(description)
            try {
                (async () => {
                    let sql = "UPDATE profiles SET description = ? WHERE id = ?";
                    const rows = await query(sql, [description, readToken.readId(req.header('auth-token'))]);
                    let string = JSON.stringify(rows);

                    res.header('profile'," Profiilin kuvaus muokattu.").send();
                })()

            } catch (err) {
                console.log("Database error! " + err);
            }
        else {
            res.header('profile'," Profiilin kuvausta ei muokattu.").send();
        }
    });

//http://localhost:8081/users/register?name=nimi&password=salasana&email=sähköposti
//http://localhost:8081/users/register?name=&password=&email=
    app.post('/users/register', (req,res) => {
        const name = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        var sql = "SELECT * FROM users WHERE name = ? OR email = ?";
        var string;
        if(!name || !password || !email)
            res.header('register', "Rekisteröinti epäonnistui. Käyttäjänimi, sähköposti tai salasana on puutteelinen.").send();
        else
        (async () => {
            try {
                const rows = await query(sql, [name, email]);

                string = JSON.stringify(rows);
                if(rows.length > 0){
                    res.header('register'," Rekisteröinti epäonnistui. Käyttäjänimi tai sähköposti on jo käytössä.").send();
                } else {

                    sql = "INSERT INTO users (name, email, password) "
                        + "VALUES (?, ?, SHA1(?))"
                    const rows2 = await query(sql, [name, email, password]);
                    string = JSON.stringify(rows2);
                    const newUserId = rows2.insertId;
                    console.log("Uusi käyttäjä, id: "+newUserId);
                    sql = "INSERT INTO profiles (id) "
                        + "VALUES (?)"
                    const rows3 = await query(sql, [newUserId]);
                    res.header('register',"onnistui").send();
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
        const email = req.body.email;
        const password = req.body.password;
        var sql = "SELECT * FROM users WHERE email = ? AND password = SHA1(?)";
        var string;
        if(!email || !password) {
            res.header("login", "Sähköposti tai salasana ei ole määritetty.");
            res.header("status", "failed").send();
        } else (async () => {
            try {
                const rows = await query(sql, [email, password]);

                string = JSON.stringify(rows);
                if(rows.length > 0){
                    console.log("Käyttäjä kirjautui, id "+rows[0].id);
                    //Tehdään token
                    const token = jwt.sign({id: rows[0].id}, process.env.TOKEN_SECRET);
                    res.header('auth-token', token);
                    res.header('username', rows[0].name);
                    res.header('email', rows[0].email);
                    res.header('id', rows[0].id);
                    res.header("login", "Kirjautuminen onnistui.");
                    res.header("status", "success").send();
                } else {
                    string = JSON.stringify(rows);
                    res.header("login", "Kirjautuminen epäonnistui. Sähköposti ja salasana eivät täsmää.");
                    res.header("status", "failed").send();
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