'use strict'; //standard of node.js
var express = require('express'); //standard of node.js
var path = require('path'); //standard of node.js
var https = require('https'); //standard of node.js
var http = require('http'); //standard of node.js
var PORT  = process.env.PORT || 5000; //standard of node.js
var app = express(); //standard of node.js
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views')); //standard of node.js
app.set('view engine', 'ejs'); //standard of node.js
app.get('/', function (req, res) {
    res.render('index', {fname: 'Songsakdi', lName: 'Rongviri'});
});
app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
});
app.get("/info/:id", async function (req, res) {
    var nameid = req.params.id;
    console.log(nameid);
    const data = await getStudentInfo(nameid);
    console.log(data);
    if (data) {
        let j = JSON.parse(data);
        res.render("menu",
            {
                prefix: j.data.prefixname,
                name_th: j.data.displayname_th,
                name_en: j.data.displayname_en,
                email: j.data.email,
                faculty: j.data.faculty,
                department: j.data.department
            });
    }
});
app.post("/api", async (req, res) => {
    //const queryParams = req.query;
    //let result = "";
    //console.log(queryParams);
    console.log(req.body);
    const temp = await getlogin(req.body.user, req.body.pwd);
    console.log("temp = " + temp);
    if (temp) {
        let j = JSON.parse(temp);
        console.log(j);
        if (j.status == true) {
            res.render("menu");
            //res.send("Name th: " + j.displayname_th);
        } else {
            res.send('{"status":false}');
        }
        // if (j.data.status == true) {
        //   res.send("ʶҹ�:  �ѡ�֡��")
        // } else (j.data.status)
        // req.send("ʶҹ�: ��ʶҾ")
    } else {
        res.send('{"status":false}');
    }
    //console.log(result);
    //res.send(JSON.stringify(temp));
    //} else {
    // res.send("login fail");
    // }
});
const getlogin = (userName, password) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'hostname': 'restapi.tu.ac.th',
            'path': '/api/v1/auth/Ad/verify',
            'headers': {
                'Content-Type': 'application/json',
                'Application-Key': 'TUa2e215505b9e2e75472dfe964b5bf566f650b84b1892206d9c26c0669874d7cc00bdf6a7fa9e90853552b48c1cbc6a2d'
            }
        };
        var req = https.request(options, (res) => {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                //result = body;
                resolve(body.toString());
                //result = chunks;
            });
            res.on("error", function (error) {
                console.error(error);
                reject(error);
            });
        });
        var postData = "{\n\t\"UserName\":\"" + userName + "\",\n\t\"PassWord\":\"" + password + "\"\n}";
        req.write(postData);
        req.end();
    });
};
const getStudentInfo = (username) => {
    return new Promise((resolve, reject) => {
        var options = {
            method: "GET",
            hostname: "restapi.tu.ac.th",
            path: "/api/v2/profile/std/info/?id=" + username,
            headers: {
                "Content-Type": "application/json",
                "Application-Key":
                    "TUa2e215505b9e2e75472dfe964b5bf566f650b84b1892206d9c26c0669874d7cc00bdf6a7fa9e90853552b48c1cbc6a2d",
            },
        };
        var req = https.request(options, (res) => {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                //result = body;
                resolve(body.toString());
                //result = chunks;
            });
            res.on("error", function (error) {
                console.error(error);
                reject(error);
            });
        });
        req.end();
    });
};
app.get('/menu', function (req, res) {
    res.render('menu')
});
app.get('/doc', function (req, res) {
    res.render('doc')
});
app.get('/next', function (req, res) {
    res.render('next')
});
app.get('/condition', function (req, res) {
    res.render('condition')
});
// const options = {
//     hostname: 'jsonplaceholder.typicode.com',
//     path: '/posts/1/comments',
//     method: 'GET',
//     'headers': {
//         'Content-Type': 'application/json',
//     }
// };
// function dataCounter(inputs) {
//     let counter = 0;
//     for (const input of inputs) {
//         if (input.postId === 1) {
//             counter += 1;
//             console.log('input.postId:' + input.postId);
//             console.log('input.email:' + input.email);
//         }
//     }
//     return counter;
// };
// const req = http.request(options, function(response) {
//     response.setEncoding('utf8');
//     var body = '';
//     response.on('data', chunk => {
//         body += chunk;
//     });
//     response.on('end', () => {
//         console.log('body:' + body);
//         var data = JSON.parse(body);
//         console.log('number of posts:' + dataCounter(data));
//         console.log('data:' + data);
//         console.log('data[0]:' + data[0]);
//         console.log('data[0].id:' + data[0].id);
//         console.log('data[0].email:' + data[0].email);
//         console.log('end of GET request');
//     });
// });
// req.on('error', e => {
//     console.log('Problem with request:', e.message);
// });
// req.end();