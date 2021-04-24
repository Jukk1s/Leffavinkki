const nodeServer = "localhost:8081";

function getMovies() {
    //document.getElementById("resultField").innerHTML = "";

    let name = document.getElementById("movie_name").value.replace(/  +/g, '%20');
    //name.replace(/\s/g, '')
    let year = Number(document.getElementById("movie_year").value);

    let movieYear = "";

    if(year > 1800 && Number.isInteger(year)){
        movieYear = "&y=" + year;
    }
    let url = "http://www.omdbapi.com/?r=json&s=";
    let apiKey = "&apikey=bfbd237f";

    (async () => {
        console.log(url + name + movieYear + apiKey + ", " + Number.isInteger(year) + year);
        try{
            const response = await fetch(url + name + movieYear + apiKey);
            if(response){
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                localStorage.setItem("lastSearch", JSON.stringify(jsonResponse));
                showResults(jsonResponse);
            }
        }catch(error){
            console.log(error);
        }
    })()
}

function showResults(jsonResponse) {
    // console.log(Object.keys(jsonResponse.Search).length);

    console.log(jsonResponse);

    const div = document.getElementById("resultField");
    //Tyhjennetään tuloskenttä ennen elokuvien näyttämistä
    div.innerHTML = "";

    for (let i = 0; i < Object.keys(jsonResponse.Search).length; i++) {
        //Jokaiselle elokuvalle oma a- ja div -elementti
        let movieLink = document.createElement("a");
        movieLink.href = "movie.html";

        let movieDiv = document.createElement("div");
        movieDiv.className = "movieDiv";
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
        movieDiv.appendChild(img);

        movieLink.appendChild(movieDiv);
        div.appendChild(movieLink);
    }
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
    if(data.length > 0)
        showResults(jsonData);
}