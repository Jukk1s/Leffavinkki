function getMovies() {
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
            }
        }catch(error){
            console.log(error);
        }
    })()

}