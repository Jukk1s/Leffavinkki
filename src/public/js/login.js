const nodeServer = "http://localhost:8081";
$('#logform').submit(function(e){
    e.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    console.log(email + password);

    var formData =  '{"email":"' + email + '", "password":"' + password + '"}';
    var jsonFormData = JSON.parse(formData);
    console.log(JSON.stringify(jsonFormData));

    console.log(jsonFormData);
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
    console.log(token+username+email);
    localStorage.setItem("auth-token",token);
    localStorage.setItem("logged-user",username);
    localStorage.setItem("logged-email",email);
    console.log('Tervetuloa takaisin '+username+"!");
}