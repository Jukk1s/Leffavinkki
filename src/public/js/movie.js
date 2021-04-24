const nodeServer = "http://localhost:8081";
const apiurl = "http://www.omdbapi.com/?r=json&i=";
let apiKey = "&apikey=bfbd237f";
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
                    const response = await fetch(apiurl + movieID + apiKey);
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
    const img = document.getElementById("poster");
    h.innerHTML = data.Title;
    img.src = data.Poster;
    img.alt = "Poster of " + data.Title;
    showComments(data.imdbID);
}

//showcomments?id=elokuvanid
function showComments(id){

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