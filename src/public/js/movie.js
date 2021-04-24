const apiurl = "http://www.omdbapi.com/?r=json&i=";
let apiKey = "&apikey=bfbd237f";
/*
let data = localStorage.getItem("movieData");
let jsonData = JSON.parse(data);
*/

function showMovie(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(queryString);
    console.log(urlParams);
    try{
        const movieID = urlParams.get('id');
        (async () => {
            console.log(apiurl + movieID + apiKey);
            try{
                const response = await fetch(apiurl + movieID + apiKey);
                if(response){
                    const jsonResponse = await response.json();
                    console.log(jsonResponse);
                    localStorage.setItem("movieData", JSON.stringify(jsonResponse));
                    showResult(jsonResponse);
                }
            }catch(error){
                console.log(error);
            }
        })()
    } catch (err){
        console.log(err);
    }
}

function showResult(data){
    console.log(data);
    const h = document.getElementById("title");
    const img = document.getElementById("poster");
    h.innerHTML = data.Title;
    img.src = data.Poster;
    img.alt = "Poster of " + data.Title;
}

