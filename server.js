'use strict'; //standard of node.js
var express = require('express'); //standard of node.js
var path = require('path'); //standard of node.js
var https = require('https'); //standard of node.js
var http = require('http'); //standard of node.js
var PORT  = process.env.PORT || 5000; //standard of node.js
var app = express(); //standard of node.js
var bodyParser = require("body-parser");

let idd;
let name_thh;
let name_enn;
let emaill;
let facultyy;
let departmentt;

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
app.get("/info", async function (req, res) {
    var nameid = req.params.id;
    console.log(nameid);
    const data = await getStudentInfo(nameid);
    console.log(data);
    if (data) {
        let j = JSON.parse(data);
        res.render("info",
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
            idd = j.username;
            name_thh = j.displayname_th;
            name_enn = j.displayname_en;
            emaill = j.email;
            facultyy = j.faculty;
            departmentt = j.department;

            res.render("menu",{
                id : j.username,
                name_th : j.displayname_th,
                name_en : j.displayname_en,
                email : j.email,
                faculty : j.faculty,
                department : j.department,
            });
            //res.send("Name th: " + j.displayname_th);
        } else {
            res.render("index");
        }
        // if (j.data.status == true) {
        //   res.send("ʶҹ�:  �ѡ�֡��")
        // } else (j.data.status)
        // req.send("ʶҹ�: ��ʶҾ")
    } else {
        res.render("index");
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
                'Application-Key': 'TU9953cd5bd4302c35165ef40134d0ad4a36ecd7d80b66082d5d782604926bc3b35b20d8a710b9f48ba316717f904903b5'
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
                    "TU9953cd5bd4302c35165ef40134d0ad4a36ecd7d80b66082d5d782604926bc3b35b20d8a710b9f48ba316717f904903b5",
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
    res.render('menu',{
        id : idd,
        name_th : name_thh,
        name_en : name_enn,
        email : emaill,
        faculty : facultyy,
        department : departmentt
    })
});
app.get('/doc', function (req, res) {
    res.render('doc',{
        id : idd,
        name_th : name_thh,
        name_en : name_enn,
        email : emaill,
        faculty : facultyy,
        department : departmentt
    })
});
app.get('/next', function (req, res) {
    res.render('next',{
        id : idd,
        name_th : name_thh,
        name_en : name_enn,
        email : emaill,
        faculty : facultyy,
        department : departmentt
    })
});
app.get('/condition', function (req, res) {
    res.render('condition',{
        id : idd,
        name_th : name_thh,
        name_en : name_enn,
        email : emaill,
        faculty : facultyy,
        department : departmentt
    })
});
app.get('/tc', function (req, res) {
    res.render('teachercheck',{
        id : idd,
        name_th : name_thh,
        name_en : name_enn,
        email : emaill,
        faculty : facultyy,
        department : departmentt
    })
});
app.get('/approve', function (req, res) {
    res.render('appprove',{
        id : idd,
        name_th : name_thh,
        name_en : name_enn,
        email : emaill,
        faculty : facultyy,
        department : departmentt
    })
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