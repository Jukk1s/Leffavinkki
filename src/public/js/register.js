const nodeServer = "http://localhost:8081";
const errorField = document.getElementById("errorMessage");

$('#regform').submit(function(e){
    e.preventDefault();

    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    console.log(username + email + password);

    var jsonFormData =  JSON.parse('{"username":"'+username+'", "email":"' + email + '", "password":"' + password + '"}');
    console.log(JSON.stringify(jsonFormData));

    console.log(jsonFormData);
    var xhr=$.ajax({
        url: nodeServer + '/users/register',
        type: 'post',
        data: jsonFormData,
        success:function(){
            registerState(xhr.getResponseHeader("register"));
        }
    });

});

function registerState(state) {
    errorField.innerHTML = state;
    if(state==="onnistui") {
        logOut();
        window.open(nodeServer + "/login", "_self");
    }
}

function logOut() {
    localStorage.setItem("auth-token", null);
    localStorage.setItem("logged-user", null);
    localStorage.setItem("logged-email", null);
    localStorage.setItem("logged-id", null);
}