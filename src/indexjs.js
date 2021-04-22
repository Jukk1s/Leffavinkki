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
                showResults(jsonResponse);
            }
        }catch(error){
            console.log(error);
        }
    })()
}

function showResults(jsonResponse) {
    // console.log(Object.keys(jsonResponse.Search).length);

    const div = document.getElementById("resultField");
    for (let i = 0; i < Object.keys(jsonResponse.Search).length; i++) {
        let h = document.createElement("h3");
        h.innerHTML = jsonResponse.Search[i].Title + " (" + jsonResponse.Search[i].Year + ")";
        div.appendChild(h);

        let img = document.createElement("img");
        img.src = jsonResponse.Search[i].Poster;
        img.alt = "Poster of " + jsonResponse.Search[i].Title;
        div.appendChild(img);

    }
}