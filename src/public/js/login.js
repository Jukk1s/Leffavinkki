const nodeServer = "http://localhost:8081";
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
            saveLoginInfo(xhr.getResponseHeader("auth-token"),xhr.getResponseHeader("username"),xhr.getResponseHeader("email"));

        }
    });
});

function saveLoginInfo(token, username, email) {
    if (token != null) {
        console.log(token+username+email);
        localStorage.setItem("auth-token",token);
        localStorage.setItem("logged-user",username);
        localStorage.setItem("logged-email",email);
        console.log('Tervetuloa takaisin '+username+"!");
    } else {
        console.log("Kirjautuminen epäonnistui");
    }

}