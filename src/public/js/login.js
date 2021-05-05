const nodeServer = "http://localhost:8081";
const errorField = document.getElementById("errorMessage");


//Tarkistaa löytyykö localstoragesta auth-token eli onko käyttäjä kirjautunut
//Jos kirjautunut, näytetään sivulla vain log out- button


function onLoad() {
     if (localStorage.getItem("auth-token") != "null") {
        document.getElementById("logform").style.visibility = "hidden";
        document.getElementById("logOutBtn").style.visibility = "visible";
    } else {
        document.getElementById("logform").style.visibility = "visible";
        document.getElementById("logOutBtn").style.visibility = "hidden";
    }
}

$('#logform').submit(function(e){
    e.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var formData =  '{"email":"' + email + '", "password":"' + password + '"}';
    var jsonFormData = JSON.parse(formData);

    var xhr=$.ajax({
        url: nodeServer + '/users/login',
        type: 'post',
        data: jsonFormData,
        success:function(){
            saveLoginInfo(xhr.getResponseHeader("auth-token"),xhr.getResponseHeader("username"),xhr.getResponseHeader("email"),xhr.getResponseHeader("id"));

        }
    });
});

function saveLoginInfo(token, username, email, id) {
    if (token != null) {
        console.log(token+username+email);
        localStorage.setItem("auth-token",token);
        localStorage.setItem("logged-user",username);
        localStorage.setItem("logged-email",email);
        localStorage.setItem("logged-id", id);
        window.open(nodeServer+"?welcome=true","_self");

    } else {
        errorField.innerHTML = "Väärä käyttäjätunnus tai salasana.";
    }

}

function logOut() {
    localStorage.setItem("auth-token", null);
    localStorage.setItem("logged-user", null);
    localStorage.setItem("logged-email", null);
    localStorage.setItem("logged-id", null);

    document.getElementById("logform").style.visibility = "visible";
    document.getElementById("logOutBtn").style.visibility = "hidden";
}