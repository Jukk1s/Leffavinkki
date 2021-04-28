const nodeServer = "http://localhost:8081";
const name = document.getElementById("name");
const title = document.getElementById('title');
const genres = document.getElementById('genres');
const profilePic = document.getElementById('profilePicture');
const reviewsCount = document.getElementById('reviewsCount');
const reviewCounts = document.getElementsByClassName('reviewsCount');
const commentCount = document.getElementById('commentCount');
const reviews = document.getElementById("reviews");
const status = document.getElementById('status');
const mostViewed = document.getElementById('mostViewed');

function showProfile(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.get('id')) {
        try {
            const profileID = urlParams.get('id');
            (async () => {
                try {
                    const response = await fetch(nodeServer + "/user?id=" + profileID);
                    if (response) {
                        const jsonResponse = await response.json();
                        //console.log(JSON.stringify(jsonResponse));
                        if (jsonResponse.hasOwnProperty('id')) {
                            localStorage.setItem("profileData", JSON.stringify(jsonResponse));
                            showResult(jsonResponse);
                        } else {
                            noResult(profileID);
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

    title.innerHTML = data.status;
    name.innerHTML = data.name;
    showComments(data.id);
}

//showcomments?id=elokuvanid
function showComments(id){

    const comments = document.getElementById('reviews');
    comments.innerHTML = "";
    try {
        (async () => {
            try {
                const response = await fetch(nodeServer+"/usercomments?id="+id);
                if (response) {
                    const jsonResponse = await response.json();
                    console.log(jsonResponse);
                    commentCount.innerHTML = jsonResponse.length;
                    reviewsCount.innerHTML = "Kommentit ("+jsonResponse.length+")";
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
}

function noResult(id){

    console.error('Could not find profile with id: '+id);
    //Joku error ilmoitus jos ei löydy
}