﻿// Application Log
var log4js = require('log4js');
var log4js_extend = require('log4js-extend');
log4js_extend(log4js, {
    path: __dirname,
    format: '(@file:@line:@column)'
});
log4js.configure(__dirname + '/log4js.json');
var logger = log4js.getLogger('bot');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var hashtable = require(__dirname + '/hashtable.js');

var http = require('http');
var server = http.Server(app);	// create express server
var options = {
    pingTimeout: 60000,
    pingInterval: 3000
};
var listener = server.listen(process.env.port || process.env.PORT || 3870, function () {
    logger.info('Server listening to ' + listener.address().port);
});

process.on('uncaughtException', function (err) {
    logger.error('uncaughtException occurred: ' + (err.stack ? err.stack : err));
});

var getcontactsinfo;
var displayName;
var businessPhones;
var access_token;

// Setup Express Server
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
});
// 讀取組態表
var fs = require('fs');

var config = require('fs').readFileSync(__dirname + '/config.json');
config = JSON.parse(config); //字串轉物件

var carous = require('fs').readFileSync(__dirname + '/carousel.json');
carous = JSON.parse(carous); //字串轉物件


var linequickreply = require('fs').readFileSync(__dirname + '/linequickreply.json');
linequickreply = JSON.parse(linequickreply); //字串轉物件
var quickreply = require('fs').readFileSync(__dirname + '/quickreply.json');
quickreply = JSON.parse(quickreply); //字串轉物件

app.get('/api', function (request, response) {
    response.send('API is running');
    console.log('API is running');
});

app.get('/logs', function (request, response) {
    var stream = require('fs').createReadStream('logs/messaging.log');
    stream.pipe(response);
});

app.use(express.static('pages')); //導入pages資料夾裡的東西
app.get('/indexpage', function (request, response) {
    var url = require('url');
    var querystring = require('querystring');
    console.log('GET /indexpage');
    var code = request.query.code;
    var state = request.query.state;
    var session_state = request.query.session_state;
    var urlstring = url.parse(request.url);
    var urlqueryquery = urlstring.query;
    console.log(code);
    console.log(JSON.stringify(urlstring));
    request.header("Content-Type", 'text/html');
    var fs = require('fs');
    if(state == '12345'){
        var authorization_code = code;
        // 取得 access_token
        var form = {
            grant_type: 'authorization_code',
            client_id: '8db86254-2c0b-4ec3-9b1f-92782cdbb126',
            code: authorization_code,
            redirect_uri: 'http://localhost:3870/indexpage',
            client_secret: 'rqhiWUSHY0=eduKG2153{!~'
        };
        var formData = querystring.stringify(form);
        var req = require('request');
        req({
            //利用authorization_code，向login.microsof取得token
            headers: {
                'Content-Length': formData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              uri: 'https://login.microsoftonline.com/etatung.onmicrosoft.com/oauth2/v2.0/token',
              body: formData,
              method: 'POST'
        }, function (err, res, body) {
            //取得token資訊
            var token = JSON.parse(body);
            access_token = token.access_token;
            console.log(access_token);
            var reqst = require('request');
            reqst({
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json',
                    'Content-Length': 0
                  },
                  uri: 'https://graph.microsoft.com/v1.0/me/',
                  method: 'GET'
            }, function (err, res, body) {
                var userdata = JSON.parse(body);
                businessPhones = JSON.stringify(userdata.businessPhones);
                businessPhones = businessPhones.replace('[','').replace(']','').replace('"','').replace('"','');
                if(businessPhones.length>4){
                    businessPhones = businessPhones.slice(-4);
                }
                console.log(businessPhones);
                displayName = JSON.stringify(userdata.displayName);
                displayName = displayName.replace('"','').replace('"','');
                console.log(displayName);
                var givenName = userdata.givenName;
                var jobTitle = userdata.jobTitle;
                var mail = userdata.mail;
                var mobilePhone = userdata.mobilePhone;
                //console.log(mobilePhone);
                var officeLocation = userdata.officeLocation;
                var preferredLanguage = userdata.preferredLanguage;
                var surname = userdata.surname;
                var userPrincipalName = userdata.userPrincipalName;
                var id = userdata.id;
                var requst = require('request');
                requst({
                    headers: {
                        'Authorization':  access_token,
                        'Content-Type': 'application/json'
                      },
                      uri: 'http://172.31.9.219:777/graph/getcontacts',
                      method: 'GET'
                }, function (err, res, body) {
                    if(err){
                        console.log(err);
                    }
                    getcontactsinfo = body;
                    fs.readFile(__dirname + '/pages/indexpage.html', 'utf8', function (err, data) {
                        console.log(typeof(displayName));
                        console.log(displayName);
                        if (err) {
                            this.res.send(err);
                        }
                        data = data+'<script type="text/javascript"> var displayName =  ' + displayName + '</script>';
                        this.res.send(data);
                    }.bind({ req: request, res: response }));
                });
            });
            
        });
       /* fs.readFile(__dirname + '/pages/indexpage.html', 'utf8', function (err, data) {
            if (err) {
                this.res.send(err);
            }
            //data = data+'<script type="text/javascript"> var displayName =  ' + displayName + '</script>';
            this.res.send(data);
        }.bind({ req: request, res: response }));*/
    } else{
        console.log('indexpage to login');
        response.redirect('/login');
    }
    
});
app.get('/login', function (request, response) {
    console.log('GET /login');
    request.header("Content-Type", 'text/html');
    var nonce = "";
    nonce = new Date().getTime();
    //nonce = 'testnonce';
    var fs = require('fs');
    fs.readFile(__dirname + '/pages/login.html', 'utf8', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        data = data+'<script type="text/javascript"> var nonce = " ' + nonce + ' ";</script>';
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

/*app.post('/keysearch',function(req,res){
    console.log('POST /keysearch');
    var keysearchdata = req.body.keysearchdata;
    var jsongetcontactsinfo = JSON.parse(getcontactsinfo);

})*/

app.post('/indexpage', function(req, res){
    console.log('POST /login');
    //res.send('');
    var err = req.body.err;
    if (err) {
        console.error('error: ' + err + ', error_description: ' + req.body.error_description);
    }
    var state = req.body.state;
    if (state == '12345') {
        var id_token = req.body.id_token;
        var jwt = require('jwt-simple');
        var token = jwt.decode(id_token, '', true);
        var authorization_code = req.body.code;
        console.dir(token);
        console.dir(authorization_code);
        // 取得 access_token
        var querystring = require('querystring');
        var request = require('request');
        var form = {
            grant_type: 'authorization_code',
            client_id: '8db86254-2c0b-4ec3-9b1f-92782cdbb126',
            code: authorization_code,
            redirect_uri: 'https://caserverhtmltest.herokuapp.com/indexpage',
            client_secret: 'rqhiWUSHY0=eduKG2153{!~'
        };
        var formData = querystring.stringify(form);
        request({
            headers: {
              'Content-Length': formData.length,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            uri: 'https://login.microsoftonline.com/etatung.onmicrosoft.com/oauth2/v2.0/token',
            body: formData,
            method: 'POST'
        }, function (err, res, body) {
            var token = JSON.parse(body);
            console.dir(token);
            var access_token = token.access_token;
            var request = require('request');
            request({
                headers: {
                  'Authorization': 'Bearer ' + access_token,
                  'Content-Type': 'application/json',
                  'Content-Length': 0
                },
                uri: 'https://graph.microsoft.com/v1.0/me/',
                method: 'GET'
            }, function (err, res, body) {
                console.info(body);
            });
        });
        res.redirect('/indexpage');
    }
})

app.post('/search',function(req,res){
    console.log('POST /search');
    var searchdata = req.body.searchdata;
    console.log(searchdata);
    var jsongetcontactsinfo = JSON.parse(getcontactsinfo);
    console.log(jsongetcontactsinfo.data.length);
    for(var i=0; i<jsongetcontactsinfo.data.length;i++){
        console.log(jsongetcontactsinfo.data[i].displayName);
        var displayName = jsongetcontactsinfo.data[i].displayName;
        displayName = displayName.slice(0,3);
        console.log(displayName);
        if(searchdata == displayName){
            res.send(jsongetcontactsinfo.data[i]);
        }
    }
    res.send('wrong');
})

app.get('/images/tatungba.jpg', function (request, response) {
    var picture = request.params.picture;
    request.header("Content-Type", 'image/jpeg');
    fs.readFile(__dirname + '/images/tatungba.jpg', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

app.get('/images/tstiball.png', function (request, response) {
    var picture = request.params.picture;
    request.header("Content-Type", 'image/jpeg');
    fs.readFile(__dirname + '/images/tstiball.png', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

app.get('/images/night.jpg', function (request, response) {
    var picture = request.params.picture;
    request.header("Content-Type", 'image/jpeg');
    fs.readFile(__dirname + '/images/night.jpg', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

/*
app.get('/vendor/bootstrap/css/bootstrap.css', function (request, response) {
    console.log('GET /vendor/bootstrap/css/bootstrap.css');
    var fs = require('fs');
    request.header("Content-Type", 'text/css');
    fs.readFile(__dirname + '/vendor/bootstrap/css/bootstrap.css', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});
app.get('/css/simple-sidebar.css', function (request, response) {
    console.log('GET /css/simple-sidebar.css');
    var fs = require('fs');
    request.header("Content-Type", 'text/css');
    fs.readFile(__dirname + '/css/simple-sidebar.css', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});
app.get('/vendor/jquery/jquery.min.js', function (request, response) {
    console.log('GET /vendor/jquery/jquery.min.js');
    var fs = require('fs');
    request.header("Content-Type", 'text/javascript');
    fs.readFile(__dirname + '/vendor/jquery/jquery.min.js', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});
app.get('/vendor/bootstrap/js/bootstrap.bundle.min.js', function (request, response) {
    console.log('GET /vendor/bootstrap/js/bootstrap.bundle.min.js');
    var fs = require('fs');
    request.header("Content-Type", 'text/javascript');
    fs.readFile(__dirname + '/vendor/bootstrap/js/bootstrap.bundle.min.js', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

app.get('/scripts/jquery/jquery-2.1.0.min.js', function (request, response) {
    console.log('GET /scripts/jquery/jquery-2.1.0.min.js');
    var fs = require('fs');
    request.header("Content-Type", 'text/javascript');
    fs.readFile(__dirname + '/scripts/jquery/jquery-2.1.0.min.js', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});*/


