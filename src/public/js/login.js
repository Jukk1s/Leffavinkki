const nodeServer = "http://localhost:8081";
const errorField = document.getElementById("errorMessage");

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