const nodeServer = "http://localhost:8081";
const errorField = document.getElementById("errorMessage");

$('#regfrom').submit(function(e){
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
}