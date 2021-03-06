const nodeServer = "http://localhost:8081";
const apiurl = "http://www.omdbapi.com/?r=json&i=";
let apiKey = "&apikey=bfbd237f";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const movieID = urlParams.get('id');
const commentField = document.getElementById("newComment");
const headerField = document.getElementById("newHeading");
const authorizationToken = localStorage.getItem('auth-token');
let movieTitle = "Tyhjä";
let reviewList = [];

function onLoad(){
    getReviews();
    showMovie();
}

const reviewStars = [
    document.getElementById("star1"),
    document.getElementById("star2"),
    document.getElementById("star3"),
    document.getElementById("star4"),
    document.getElementById("star5")
]

const newReviewStars = [
    document.getElementById("starR1"),
    document.getElementById("starR2"),
    document.getElementById("starR3"),
    document.getElementById("starR4"),
    document.getElementById("starR5")
];
let selectedStar = newReviewStars[0];
highlightSelectedStar();

for(let i = 0; i < newReviewStars.length; i++){
    newReviewStars[i].addEventListener("click", function(event){
        selectedStar = newReviewStars[i];
        let rating = newReviewStars.indexOf(selectedStar) + 1;
        addRating(rating);
    });
    newReviewStars[i].addEventListener("mouseenter", function(event){
        starRemoveHighlight();
        for(let l = 0; l <= i; l++){
            newReviewStars[l].classList.add('checked');
        }
    });
    newReviewStars[i].addEventListener("mouseleave", function(event){
        for(let l = 0; l <= i; l++){
            newReviewStars[l].classList.remove('checked');
        }
        highlightSelectedStar();
    });
}

//Lähettää kommentin serverille
$('#commentForm').submit(function(e){
    e.preventDefault();

    let newHeading = (document.getElementById('newHeading').value).replace(/[\-[\]\\'/"]/g, "\\$&");
    let newComment = (document.getElementById('newComment').value).replace(/[\-[\]\\'/"]/g, "\\$&");
    //newHeading.replace(/[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, "\\$&");
    //newComment.replace(/[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, "\\$&");
    console.log(newHeading);
    console.log(newComment);


    var formData =  '{"movieId":"' + movieID + '", "movieTitle":"' + movieTitle + '", "header":"' + newHeading
        + '" , "content":"' + newComment + '" }';
    var jsonFormData = JSON.parse(formData);

    console.log(jsonFormData);

    $.ajax({
        beforeSend: function(request) {
            request.setRequestHeader("auth-token", authorizationToken);
        },
        url: nodeServer + "/movies/addcomment",
        type: 'post',
        data: jsonFormData,
        success:function(){
            showComments(movieID);
        }
    });
});

function starRemoveHighlight(){
    for(let i = 0; i < newReviewStars.length; i++){
        newReviewStars[i].classList.remove('checked');
    }
}

function highlightSelectedStar() {
    starRemoveHighlight();
    console.log(newReviewStars.indexOf(selectedStar));
    for(let i = 0; i <= newReviewStars.indexOf(selectedStar); i++){
        newReviewStars[i].classList.add('checked');
    }
}

//Lähettää arvostelun (1-5) serverille
function addRating(rating) {
    let ratingJson = JSON.parse('{"rating":"' + rating + '", "movie_id":"' + movieID + '"}');
    //console.log(ratingJson);
    $.ajax({
        type: "post",
        url: nodeServer + "/movies/addrating",
        data: ratingJson,
        beforeSend: function(request) {
            request.setRequestHeader("auth-token", authorizationToken);
        }
    });
}

//urlin perässä pitää olla ?id=elokuvanid
function showMovie(){
    if(urlParams.get('id')) {
        try {
            (async () => {
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
    //movieId = data.imdbID;
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

    movieTitle = data.Title;

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
    img.onerror = function() {
        this.src = '/img/poster_holder.jpg';
    }
    plot.innerHTML = data.Plot;
    showComments(data.imdbID);
}

//movies/showcomments?id=elokuvanid
function showComments(id){

    const comments = document.getElementById('comments');
    comments.innerHTML = "";
    commentField.value = "";
    headerField.value = "";
    try {
        (async () => {
            console.log("Searching for comments: "+nodeServer+"/movies/getcomments?id="+id);
            try {
                const response = await fetch(nodeServer+"/movies/getcomments?id="+id);
                if (response) {
                    const jsonResponse = await response.json();
                    console.log(jsonResponse);
                    for(var i = jsonResponse.length-1; i >= 0; i--){
                        if(jsonResponse[i].hasOwnProperty('id')) {
                            let reviewID = jsonResponse[i].reviews_id;
                            let commentID = jsonResponse[i].id;
                            let header = jsonResponse[i].header;
                            let comment = jsonResponse[i].comment;
                            let date = jsonResponse[i].date.split('T')[0];
                            let userId = jsonResponse[i].users_id;
                            let userName = jsonResponse[i].name;
                        //    console.log(reviewID+", "+commentID,+", "+header+", "+comment+", "+date+", "+userId);

                            let review = "Ei arvostelua";

                            for(var l = reviewList.length-1; l >= 0; l--){
                                if(reviewList[l].hasOwnProperty('id')) {
                                    if (userId === reviewList[l].users_id) {
                                        review = reviewList[l].review + "/5";
                                    };
                                }
                            }

                            let cDiv = document.createElement('div');
                            cDiv.className = "comment";

                            let pDiv = document.createElement('div');
                            pDiv.className = "commentProfilepic";
                            let contentDiv = document.createElement('div');
                            contentDiv.className = "commentContent"

                            let cHeader = document.createElement('h3');
                            cHeader.innerHTML = header;
                            contentDiv.appendChild(cHeader);

                            let cText = document.createElement('p');
                            cText.innerHTML = comment;
                            contentDiv.appendChild(cText);

                            let cAuthorProfile = document.createElement('a');
                            cAuthorProfile.href = nodeServer + "/profile?id="+userId;

                            let cAuthor = document.createElement('p');
                            cAuthor.innerHTML = "Käyttäjä: " + userName;

                            cAuthorProfile.appendChild(cAuthor);
                            contentDiv.appendChild(cAuthorProfile);

                            let cRating = document.createElement("p");
                            cRating.innerHTML = review;
                            contentDiv.appendChild(cRating);

                            let cDate = document.createElement('h5');
                            cDate.innerHTML = date;
                            contentDiv.appendChild(cDate);

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

function getReviews(){
    const starReview = document.getElementById('starReview');
    const reviewCountField = document.getElementById('reviewCount');
    try {
        (async () => {
            console.log("Searching for reviews: "+nodeServer+"/movies/getreviews?id="+movieID);
            try {
                const response = await fetch(nodeServer+"/movies/getreviews?id="+movieID);
                if (response) {
                    const jsonResponse = await response.json();
                    reviewList = jsonResponse;
                    console.log(jsonResponse);
                    let reviewCount = 0;
                    let sum = 0;

                    for(var i = jsonResponse.length-1; i >= 0; i--){
                        if(jsonResponse[i].hasOwnProperty('id')) {
                            reviewCount++;
                            sum += jsonResponse[i].review;
                        }
                    }
                    let median = 0;
                    if(reviewCount!==0)
                        median = sum/reviewCount;
                    console.log('Reviews: '+reviewCount+", median: "+median+" - sum: "+sum);
                    displayReview(Math.round(median));
                    reviewCountField.innerHTML = "Arvosteltu " + reviewCount + " kertaa";
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

function displayReview(review){
    console.log(review);
    for(let i = 0; i < reviewStars.length; i++){
        reviewStars[i].classList.remove('checked');
        if(i<review)
            reviewStars[i].classList.add('checked');
    }
}

function noResult(id){

    console.error('Could not find movie with id: '+id);
    //Joku error ilmoitus jos ei löydy
}
