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
            saveToken(xhr.getResponseHeader("auth-token"));
        }
    });
});

function saveToken(token) {
    localStorage.setItem("auth-token",token);
    console.log(token);
}