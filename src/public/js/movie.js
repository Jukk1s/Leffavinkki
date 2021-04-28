const nodeServer = "http://localhost:8081";
const apiurl = "http://www.omdbapi.com/?r=json&i=";
let apiKey = "&apikey=bfbd237f";

const newReviewStarts = [
    document.getElementById("starR1"),
    document.getElementById("starR2"),
    document.getElementById("starR3"),
    document.getElementById("starR4"),
    document.getElementById("starR5")
];
let selectedStar = newReviewStarts[0];
highlightSelectedStar();

for(let i = 0; i < newReviewStarts.length; i++){
    newReviewStarts[i].addEventListener("click", function(event){
        selectedStar = newReviewStarts[i];
    });
    newReviewStarts[i].addEventListener("mouseenter", function(event){
        starRemoveHighlight();
        for(let l = 0; l <= i; l++){
            newReviewStarts[l].classList.add('checked');
        }
    });
    newReviewStarts[i].addEventListener("mouseleave", function(event){
        for(let l = 0; l <= i; l++){
            newReviewStarts[l].classList.remove('checked');
        }
        highlightSelectedStar();
    });
}

function starRemoveHighlight(){
    for(let i = 0; i < newReviewStarts.length; i++){
        newReviewStarts[i].classList.remove('checked');
    }
}

function highlightSelectedStar() {
    starRemoveHighlight();
    console.log(newReviewStarts.indexOf(selectedStar));
    for(let i = 0; i <= newReviewStarts.indexOf(selectedStar); i++){
        newReviewStarts[i].classList.add('checked');
    }
}
/*
let data = localStorage.getItem("movieData");
let jsonData = JSON.parse(data);
*/

//urlin perässä pitää olla ?id=elokuvanid
function showMovie(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.get('id')) {
        try {
            const movieID = urlParams.get('id');
            (async () => {
                //console.log(apiurl + movieID + apiKey);
                try {
                    const response = await fetch(nodeServer + "/movies?plot=full&i=" + movieID);
                    if (response) {
                        const jsonResponse = await response.json();
                        //console.log(JSON.stringify(jsonResponse));
                        if (jsonResponse.hasOwnProperty('imdbID')) {
                            localStorage.setItem("movieData", JSON.stringify(jsonResponse));
                            showResult(jsonResponse);
                        } else {
                            noResult(movieID);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            })()
        } catch (err) {
            console.log(err);
        }
    } else {
        noResult('no id give!!!');
    }
}

function showResult(data){
    //console.log(data);
    const h = document.getElementById("title");
    const ratingIMDB = document.getElementById('ratingIMDB');
    const ratingLEFFA = document.getElementById('ratingLeffa');
    const length = document.getElementById('length');
    const genre = document.getElementById('genre');
    const img = document.getElementById("poster");

    const plot = document.getElementById('plot');
    const director = document.getElementById('director');
    const writers = document.getElementById('writers');
    const actors = document.getElementById('actors');
    const metascore = document.getElementById('metascore');

    h.innerHTML = data.Title+" ("+data.Year+")";
    ratingIMDB.innerHTML = data.imdbRating+"/10";
    length.innerHTML = data.Runtime;
    genre.innerHTML = data.Genre;
    director.innerHTML = data.Director;
    writers.innerHTML = data.Writer;
    actors.innerHTML = data.Actors;
    metascore.innerHTML = data.Metascore;

    img.src = data.Poster;
    img.alt = "Poster of " + data.Title;
    plot.innerHTML = data.Plot;
    showComments(data.imdbID);
}

//showcomments?id=elokuvanid
function showComments(id){

    const comments = document.getElementById('comments');
    comments.innerHTML = "";
    try {
        (async () => {
            console.log("Searching for comments: "+nodeServer+"/showcomments?id="+id);
            try {
                const response = await fetch(nodeServer+"/showcomments?id="+id);
                if (response) {
                    const jsonResponse = await response.json();
                    console.log(jsonResponse);
                    for(var i = 0; i < jsonResponse.length; i++){
                        if(jsonResponse[i].hasOwnProperty('id')) {
                            let reviewID = jsonResponse[i].reviews_id;
                            let commentID = jsonResponse[i].id;
                            let header = jsonResponse[i].header;
                            let comment = jsonResponse[i].comment;
                            let date = jsonResponse[i].date;
                            console.log(reviewID+", "+commentID,+", "+header+", "+comment+", "+date);

                            let cDiv = document.createElement('div');
                            cDiv.className = "comment";

                            let pDiv = document.createElement('div');
                            pDiv.className = "commentProfilepic";
                            let contentDiv = document.createElement('div');
                            contentDiv.className = "commentContent"

                            let cHeader = document.createElement('h3');
                            cHeader.innerHTML = header;
                            contentDiv.appendChild(cHeader);

                            let cDate = document.createElement('h5');
                            cDate.innerHTML = date;
                            contentDiv.appendChild(cDate);

                            let cAuthor = document.createElement('h4');
                            cAuthor.innerHTML = reviewID;
                            contentDiv.appendChild(cAuthor);

                            let cText = document.createElement('p');
                            cText.innerHTML = comment;
                            contentDiv.appendChild(cText);
                            cDiv.appendChild(pDiv);cDiv.appendChild(contentDiv);
                            comments.appendChild(cDiv);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })()
    } catch (err) {
        console.log(err);
    }
    console.log();
}

function noResult(id){

    console.error('Could not find movie with id: '+id);
    //Joku error ilmoitus jos ei löydy
}