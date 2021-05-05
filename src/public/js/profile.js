const nodeServer = "http://localhost:8081";
const name = document.getElementById("name");
const title = document.getElementById('title');
const genres = document.getElementById('genres');
const profilePic = document.getElementById('profilePicture');
const reviewsCount = document.getElementById('reviewsCount');
const reviewCounts = document.getElementsByClassName('reviewsCount');
const commentCount = document.getElementById('commentCount');
const description = document.getElementById('description');
const reviews = document.getElementById("reviews");
const status = document.getElementById('status');
const mostViewed = document.getElementById('mostViewed');
const authorizationToken = localStorage.getItem('auth-token');

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
                        if (jsonResponse[0].hasOwnProperty('id')) {
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
    console.log(data);
    //data[0] sisältää users taulun käyttäjän tiedot
    //data[1] sisältää profiles taulun käyttäjän tiedot
    title.innerHTML = data[0].status;
    name.innerHTML = data[0].name;
    description.innerHTML = data[1].description;

    //Katsotaan jos kirjautumisen ohella tallentuva käyttäjän id
    //löytyy ja on sama kuin katsottavan profiilin niin lisätään
    //nimeen myös indikaatio, että profiili on oma profiili.
    //Ensimmäisessä if lauseessa plussataan paikalliseen tallennukseen
    //tallennettu id ja palvelimen kyselyssä tullut id ja jos nämä
    //voidaan muuttaa numeroksi niitä verrataan myöhemmin
    if(Number(localStorage.getItem('logged-id')+data[0].id))
        if(Number(localStorage.getItem('logged-id')) === Number(data[0].id)){
            name.innerHTML += " (sinä)";
            description.contentEditable = true;
            let buttonDiv = document.getElementById("editButton");
            let editButton = document.createElement('button');
            editButton.onclick = function (){sendDescription()};
            editButton.textContent = "Päivitä";
            editButton.classList.add('editButton');
            buttonDiv.appendChild(editButton);
        }
    showComments(data[0].id);
}

function sendDescription(){
    let newDescription = (document.getElementById('description').innerHTML).replace(/[\-[\]\\'/"]/g, "\\$&");
    console.log(description);


    var formData =  '{"description":"' + newDescription + '"}';
    var jsonFormData = JSON.parse(formData);

    console.log(jsonFormData);

    $.ajax({
        beforeSend: function(request) {
            request.setRequestHeader("auth-token", authorizationToken);
        },
        url: nodeServer + "/users/edit",
        type: 'post',
        data: jsonFormData,
        success:function(){
        }
    });
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
                    commentCount.innerHTML = jsonResponse.length;
                    reviewsCount.innerHTML = "Kommentit ("+jsonResponse.length+")";
                    for(var i = jsonResponse.length-1; i >= 0; i--){
                        if(jsonResponse[i].hasOwnProperty('id')) {
                            let commentID = jsonResponse[i].id;
                            let title = jsonResponse[i].movie_title;
                            let header = jsonResponse[i].header;
                            let comment = jsonResponse[i].comment;
                            let date = jsonResponse[i].date;

                            let cDiv = document.createElement('div');
                            cDiv.className = "comment";

                            let pDiv = document.createElement('div');
                            pDiv.className = "commentProfilepic";
                            let contentDiv = document.createElement('div');
                            contentDiv.className = "commentContent"

                            let cMovielink = document.createElement('a');
                            cMovielink.href = nodeServer+"/movie?id="+jsonResponse[i].movie_id;

                            let cTitle = document.createElement('h2');
                            cTitle.innerHTML = title;
                            cMovielink.appendChild(cTitle);
                            contentDiv.appendChild(cMovielink);

                            let cHeader = document.createElement('h3');
                            cHeader.innerHTML = header;
                            contentDiv.appendChild(cHeader);

                            let cDate = document.createElement('h5');
                            cDate.innerHTML = date.split('T')[0];
                            contentDiv.appendChild(cDate);

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