const nodeServer = "http://localhost:8081";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let loadWelcome = urlParams.has('welcome');
if(loadWelcome === true)
    loadWelcome = urlParams.get('welcome');

function onLoad(){
    if(loadWelcome === "true")
        getWelcome();
    getRecommended();
    showLastSearch();
}

function getWelcome(){
    console.log("load welcome = "+loadWelcome);
    const div = document.getElementById('welcome');
    const name = localStorage.getItem('logged-user');
    console.log(name);
    //Katsotaan onko nimeä ja että nimessä on enemmän kuin 0 kirjainta
    if(name){
       let nameH = document.createElement('h2');
       nameH.innerHTML = "Tervetuloa takaisin "+name+"!";
       nameH.classList.add('centerText');
       nameH.style.color = 'silver';
       div.appendChild(nameH);
    }
}

$('#search').submit(function(e){
    e.preventDefault();
    <!--    HAETAAN NODE SERVERILTÄ    -->

    let name = document.getElementById("movie_name").value.replace(/  +/g, '%20');
    let year = Number(document.getElementById("movie_year").value);

    let movieYear = "";

    if(year > 1800 && Number.isInteger(year)){
        movieYear = "&y=" + year;
    }

    let xhr=$.ajax({
        url: nodeServer + "/movies?page=3&s=" + name + movieYear,
        type: 'get',
        data: String,
        success:function(data){
            localStorage.setItem("lastSearch", JSON.stringify(data))
            showResults(data);
        }
    });

});

function getRecommended(){
    <!--    HAETAAN NODE SERVERILTÄ    -->

    let url = nodeServer + "/movies/recommended";
    console.log(nodeServer + "/movies/recommended");

    (async () => {
        try{
            const response = await fetch(url);
            if(response){
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                localStorage.setItem("lastRecommended", JSON.stringify(jsonResponse));
                showRecommended(jsonResponse);
            }
        }catch(error){
            console.log(error);
        }
    })();
}

function showRecommended(jsonResponse){
    const div = document.getElementById('recommended');
    //Tyhjennetään tuloskenttä ennen elokuvien näyttämistä
    div.innerHTML = "";

    //for (let i = 0; i < Object.keys(jsonResponse.Search).length; i++)
    for (let i = 0; i < jsonResponse.length; i++) {
        //Jokaiselle elokuvalle oma a- ja div -elementti
        let movieLink = document.createElement("a");

        console.log(jsonResponse[i].movie_id);

        movieLink.href = "http://localhost:8081/movie?id="+jsonResponse[i].movie_id;

        let movieDiv = document.createElement("div");
        movieDiv.classList.add("movieDiv");
        movieDiv.classList.add("recommendedDiv");


        //Elokuvan JSON
        const data = jsonResponse[i];
        //console.log(data);


        movieDiv.addEventListener('click', function(){
            console.log(data);
            openMovie(data);
        });


        let overlay = document.createElement("div");
        overlay.classList.add('overlay');
        let h = document.createElement("h3");
        h.innerHTML = jsonResponse[i].header;
        //let comment = document.createElement("p");
        //comment.innerHTML = jsonResponse[i].comment;
        overlay.appendChild(h);
        //overlay.appendChild(comment);
        movieDiv.appendChild(overlay);

        let img = document.createElement("img");
        img.src = jsonResponse[i].movie_poster;
        img.alt = "Poster of " + jsonResponse[i].movie_title;

        //Jos kuva ei lataa
        img.onerror = function() {
            this.src = '/img/poster_holder.jpg';
        }
        img.classList.add('poster');
        movieDiv.appendChild(img);

        movieLink.appendChild(movieDiv);
        div.appendChild(movieLink);
    }
}

function showResults(jsonResponse) {
    // console.log(Object.keys(jsonResponse.Search).length);

    console.log(jsonResponse);

    const div = document.getElementById("resultField");
    //Tyhjennetään tuloskenttä ennen elokuvien näyttämistä
    div.innerHTML = "";

    if (jsonResponse.Search) {
        for (let i = 0; i < Object.keys(jsonResponse.Search).length; i++) {
            //Jokaiselle elokuvalle oma a- ja div -elementti
            let movieLink = document.createElement("a");

            console.log(jsonResponse.Search[i].imdbID);

            movieLink.href = "http://localhost:8081/movie?id="+jsonResponse.Search[i].imdbID;

            let movieDiv = document.createElement("div");
            movieDiv.classList.add("movieDiv");
            let h = document.createElement("h3");


            //Elokuvan JSON
            const data = jsonResponse.Search[i];
            //console.log(data);


            movieDiv.addEventListener('click', function(){
                console.log(data);
                openMovie(data);
            });


            h.innerHTML = jsonResponse.Search[i].Title + " (" + jsonResponse.Search[i].Year + ")";
            movieDiv.appendChild(h);

            let img = document.createElement("img");
            img.src = jsonResponse.Search[i].Poster;
            img.alt = "Poster of " + jsonResponse.Search[i].Title;

            //Jos kuva ei lataa
            img.onerror = function() {
                this.src = '/img/poster_holder.jpg';
            }
            img.classList.add('poster');
            movieDiv.appendChild(img);

            movieLink.appendChild(movieDiv);
            div.appendChild(movieLink);
        }
    }


}

function onImgError(source){
    console.log('IMAGE ERROR!!!!');
    source.src="/img/poster_holder.jpg";
    source.onerror = "";
    return true;
}

function openMovie(data){

    // Tallennetaan localStorageen data, jotta voidaan toiselta sivulta se hakea
    localStorage.setItem("movieData", JSON.stringify(data));

    console.log(data);
    console.log(data.Title);
    console.log(data.Poster);
    /*
    let xhr = new XMLHttpRequest();
    let nodePolku = "/showmovie";
    xhr.open("POST", nodeServer+nodePolku,true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

            // Print received data from server
            console.log(this.responseText);

        }
    };
    xhr.send(data);

     */
}

//Avataan paikallisesta muistista viimeisin haku
//index.htm:n body kutsuu tätä funktiota "onload"
function showLastSearch(){

    console.log("hei...");
    let data = localStorage.getItem("lastSearch");
    let jsonData = JSON.parse(data);

    //Jos löytyy vähintään yksi JSON objekti niin näytetään tulokset
    if(data !== null)
        if(data.length > 0)
        showResults(jsonData);

}