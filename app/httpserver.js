var http = require('http');
var fs = require("fs");
var dbModule = require("./DBModule");
var querystring = require("querystring");
http.createServer(function (request, response) {
    if (/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())) {
        sendFileContent(response, request.url.toString().substring(1), "text/css");
    }
    else {
        var htmlPage = null;
        switch (request.url) {
            case "/":
                htmlPage = "home.html";
                break;
            case "/login":
                htmlPage = "login.html";
                break;
            case "/signup":
                htmlPage = "signup.html";
                break;
            case "/success":
                htmlPage = "success.html";
                break;
            case "/index":
                if (performAuthentication(request)) {
                    htmlPage = "index.html";
                }
                else {
                    htmlPage = "signup.html";
                }
                break;
            default:
                break;

        }
        if (htmlPage) {
            sendFileContent(response, "views/" + htmlPage, "text/html");
        }
        else {
            console.log("Requested URL is: " + request.url);
            response.end();
        }
    }

}).listen(3000);

function sendFileContent(response, fileName, contentType) {
    fs.readFile(fileName, function (err, data) {
        if (err) {
            response.writeHead(404);
            response.write("Not Found!");
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.write(data);
        }
        response.end();
    });
}


function performAuthentication(request) {
    var data ='';
    request.on('data',function(chunk){
        data+=chunk;
    });
    request.on('end',function(){
        var userData= querystring.parse(data);
        var user = userData["uname"];
        var pass = userData["psw"];
        console.log(user);
        console.log(pass);
        return (dbModule.authenticateUser(user,pass));
    })
    
}
