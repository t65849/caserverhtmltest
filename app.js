﻿// Application Log
var log4js = require('log4js');
var log4js_extend = require('log4js-extend');
log4js_extend(log4js, {
    path: __dirname,
    format: '(@file:@line:@column)'
});
var quickSearchData = [];
resetQuickSearchData();
log4js.configure(__dirname + '/log4js.json');
var logger = log4js.getLogger('bot');

var express = require('express');
var pinyin = require("pinyin");
var app = express();
var bodyParser = require('body-parser');
var hashtable = require(__dirname + '/hashtable.js');
var Jieba = require('node-jieba');
var http = require('http');
var server = http.Server(app); // create express server
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
var analyzer = Jieba({ //==
    debug: false
});

analyzer.dict( 'dict.txt', function (err) { //==
    if (err) console.log(err)
    analyzer.pseg("嗨阿,你好呀,大同寶寶", {
        mode: Jieba.mode.SEARCH,
        HMM: true
    }, function (err, result) {
        console.log(JSON.stringify(result))
    })
});
var getusers;
var displayName;
var businessPhones;
var mydata;
var jsongetusers;

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

app.get('/api', function (request, response) {
    response.send('API is running');
    console.log('API is running');
});

app.get('/logs', function (request, response) {
    var stream = require('fs').createReadStream('logs/messaging.log');
    stream.pipe(response);
});

app.use(express.static('public'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/pages', express.static(__dirname + '/pages'));
//app.use(express.static('pages')); //導入pages資料夾裡的東西
app.get('/indexpage', function (request, response) {
    var url = require('url');
    var querystring = require('querystring');
    console.log('GET /indexpage');
    var code = request.query.code;
    var state = request.query.state;
    var session_state = request.query.session_state;
    var urlstring = url.parse(request.url);
    var urlqueryquery = urlstring.query;
    //console.log(code);
    //console.log(JSON.stringify(urlstring));
    request.header("Content-Type", 'text/html');
    var fs = require('fs');
    if (state == '12345') {
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
            console.log('***********************************************************');
            console.log('access_token');
            //console.log(access_token);
            var reqst = require('request');
            reqst({
                headers: {
                    'Authorization': access_token,
                    'Content-Type': 'application/json'
                },
                //uri: 'http://172.31.9.219:777/graph/getcontacts',
                uri: 'http://172.31.9.219:777/graph/getusers', //取得所有人資訊
                method: 'GET'
            }, function (err, res, body) {
                if (err) {
                    console.log(err);
                }
                console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
                getusers = body;
                var jsonparuser = JSON.parse(getusers);
                getusers = JSON.stringify(jsonparuser.data.value);
                var nextlink = jsonparuser.data["@odata.nextLink"];
                var checknextlink = nextlink.indexOf("=");
                var skiptoken = nextlink.substring(checknextlink + 1);
                if (nextlink != undefined) { //如果有nextlink的話
                    getnextdata(skiptoken);
                }

                function getnextdata(skiptoken) {
                    var req = require('request');
                    req({
                        headers: {
                            'Authorization': access_token,
                            'Content-Type': 'application/json'
                        },
                        //uri: 'http://172.31.9.219:777/graph/getcontacts',
                        uri: 'http://172.31.9.219:777/graph/getusers?skiptoken=' + skiptoken, //取得所有人資訊
                        method: 'GET'
                    }, function (err, res, body) {
                        if (err) {
                            console.log(err);
                        }
                        // (/.$/ 是忽略字串前面所有，忽略直到最後面的字串，指定最後一個)
                        getusers = getusers.replace(/.$/, ''); //把陣列最後面的 ] 拿掉
                        var getdata = JSON.parse(body);
                        var moredata = JSON.stringify(getdata.data.value);
                        moredata = moredata.replace('[', '');
                        getusers = getusers + ',' + moredata;
                        var nextlink = getdata.data["@odata.nextLink"];
                        if (nextlink != undefined) { //如果有nextlink的話
                            var checknextlink = nextlink.indexOf("=");
                            var skiptoken = nextlink.substring(checknextlink + 1);
                            //console.log(skiptoken);
                            getnextdata(skiptoken);
                        } else {
                            jsongetusers = JSON.parse(getusers);
                            fs.writeFile('user.txt', '', function () {});
                            for (var i = 0; i < jsongetusers.length; i++) {
                                var givenName = jsongetusers[i].givenName;
                                var surname = jsongetusers[i].surname;
                                //var jobTitle = jsongetusers[i].jobTitle;
                                var name = surname + givenName; //+jobTitle
                                jsongetusers[i].romaname = tranPinyin(name);
                                /*
                                var req = require('request');
                                req({
                                    headers: {
                                        'Content-Type': 'text/html'
                                    },
                                    uri: 'https://char.iis.sinica.edu.tw/API/pinyin_SQL.aspx',
                                    qs: {
                                        str: name,
                                        choose: '4'
                                    },
                                    method: 'GET'
                                }, function (err, res, body) {
                                    if(err){
                                        console.log(err);
                                    }
                                    romaname = body;
                                    try{
                                        jsongetusers[this.i].romaname = romaname.substring(70);
                                    }catch(e){
                                        console.log(e);
                                    }                 
                                }.bind({ i: i }));*/
                                if (this.i == jsongetusers.length - 1)
                                    console.log("TO romaname success")
                            } //end for loop

                            fs.writeFile('mytest.json', JSON.stringify(jsongetusers, null, 2), function () {
                                console.log("OK")
                            })
                        }
                    });
                }
                var requst = require('request');
                requst({
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Content-Type': 'application/json',
                        'Content-Length': 0
                    },
                    uri: 'https://graph.microsoft.com/v1.0/me/',
                    method: 'GET'
                }, function (err, res, body) {
                    mydata = body;
                    console.log(body);
                    fs.readFile(__dirname + '/pages/indexpage.html', 'utf8', function (err, data) {
                        if (err) {
                            this.res.send(err);
                        }
                        data = data + '<script type="text/javascript"> var mydata =  ' + mydata + '</script>';
                        this.res.send(data);
                    }.bind({
                        req: request,
                        res: response
                    }));
                });
            });
        });
    } else {
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
        data = data + '<script type="text/javascript"> var nonce = " ' + nonce + ' ";</script>';
        this.res.send(data);
    }.bind({
        req: request,
        res: response
    }));
});
app.post('/tatungSpeach', function (req, res) {
    console.log('POST /tatungSpech');
    var data = req.body.data;
    var tatungSpeach = req.body.tatungSpeach
    console.log("tatungSpech data: " + data);
    console.log("tatungSpech tatung :"+tatungSpeach);
    console.log('270'+typeof(data));
    analyzer.pseg(String(data), {
        mode: Jieba.mode.SEARCH,
        HMM: true
    }, function (err, result) {
        console.log(err);
        console.log('276'+typeof(result));
        console.log(JSON.stringify(result));
        var hasTatung = false;
        var hasNR = false;
        for (var i in result) {
            if (result[i][0] == "沒事"  || result[i][0] == "拜拜" || result[i][0] == "掰掰") {
                res.send('掰掰');
                return;
            }
            if (result[i][0] == "萬事達" || result[i][0] == "萬視達" || result[i][0] == "萬") hasTatung = true;
            if (result[i][1] == "nr" || result[i][1] == "ng" || result[i][1] == "nrt" || result[i][1] == "nt") hasNR = true;
            if (result[i][1] == "eng") hasNR = true;
        }
        if (hasTatung == true && hasNR == false) {
            console.log("請問有什麼事嗎");
            res.send("請問有什麼事嗎");
            return;
        } else if (hasTatung == true && hasNR == true) {
            console.log("搜尋1");
            res.send("搜尋");
            return;
        } else if (tatungSpeach=="true" && hasNR==true) {
            console.log("搜尋2");
            res.send("搜尋");
            return;
        } else {
            console.log("沒叫我");
            res.send("沒叫我");
            return;
        }
    })
})
/*app.post('/tatungSpeach', function (req, res) {
    console.log('POST /tatungSpech');
    var data = req.body.data;
    var tatungSpeach = req.body.tatungSpeach
    console.log("tatungSpech data: " + data)
    analyzer.pseg(data, {
        mode: Jieba.mode.SEARCH,
        HMM: true
    }, function (err, result) {
        console.log(JSON.stringify(result))
        var hasTatung = false;
        var hasNR = false;
        for (var i in result) {
            if (result[i][0] == result[i][0] == "沒事"  || result[i][0] == "拜拜" || result[i][0] == "掰掰") {
                res.send('掰掰');
                return;
            }
            if (result[i][0] == "萬事達" || result[i][0] == "萬視達") hasTatung = true;
            if (result[i][1] == "nr" || result[i][1] == "ng" || result[i][1] == "nrt" || result[i][1] == "nt") hasNR = true;
            if (result[i][1] == "eng") hasNR = true;
        }
        if (hasTatung == true && hasNR == false) {
            console.log("請問有什麼事嗎");
            res.send("請問有什麼事嗎");
            return;
        } else if (hasTatung == true && hasNR == true) {
            console.log("搜尋");
            res.send("搜尋");
            return;
        } else if (tatungSpeach && hasNR) {
            console.log('hasTatung '+hasTatung);
            console.log('hasNR '+hasNR);
            console.log("搜尋");
            res.send("搜尋");
            return;
        } else {
            console.log('hasTatung '+hasTatung);
            console.log('hasNR '+hasNR);
            console.log("沒叫我");
            res.send("沒叫我");
            return;
        }
    })
})*/
app.post('/search', function (req, res) {
    console.log('POST /search');
    var searchdata = req.body.searchdata;
    console.log(searchdata);
    var flag = false;
    for (var i in quickSearchData) {
        if (quickSearchData[i].index == searchdata) {
            //console.log(quickSearchData[i].answer);
            flag = true;
            res.send(quickSearchData[i].answer);
            return;
        }
    }
    if (!flag) {
        var newromaname = '';
        var romaforname = '';
        var resdata = '';
        console.log(jsongetusers.length);
        var datacount = 0;
        console.log('371'+typeof(searchdata));
        console.log('372'+searchdata);
        if (searchdata === '') {
            resdata = JSON.stringify(jsongetusers);
            res.send(resdata);
        } else {
            //---------取得使用者輸入文字的羅馬拼音------------
            var req = require('request');
            console.log('379'+typeof(searchdata));
            console.log('380'+searchdata);
            analyzer.pseg(String(searchdata), {
                mode: Jieba.mode.SEARCH,
                HMM: true
            }, function (err, result) {
                if (err) console.log(err)
                else {
                    console.log('387'+typeof(result));
                    console.log(JSON.stringify(result))
                    for (var i in result) {
                        if (result[i][1] == "nr" || result[i][1] == "ng" || result[i][1] == "nrfg" || result[i][1] == "nrt" || result[i][1] == "nt" || result[i][1] == "nz") {
                            var myAnswer = {
                                index: "",
                                answer: ""
                            }
                            myAnswer.index = result[i][0];
                            var levenshtein = require('js-levenshtein');
                            newromaname = tranPinyin(result[i][0]);
                            console.log(newromaname);
                            for (var j = 0; j < jsongetusers.length; j++) {
                                romaforname = jsongetusers[j].romaname;
                                if (romaforname.split(' ').length >= 2) {
                                    if (newromaname != null && romaforname != null)
                                        if (1 - (levenshtein(newromaname, romaforname.split(' ')[0]) / romaforname.split(' ')[0].length) >= 0.77 || romaforname.indexOf(newromaname) != -1) {
                                            console.log("未切: " + newromaname + ", " + romaforname)
                                            //console.log("數量: " + levenshtein(newromaname, romaforname))
                                            console.log("分數: " + Number(1 - (levenshtein(newromaname, romaforname.split(' ')[0]) / romaforname.length)))
                                            var finddata = JSON.stringify(jsongetusers[j]);
                                            switch (datacount) {
                                                case 0: //第一筆資料
                                                    resdata += finddata;
                                                    datacount++;
                                                    break;
                                                default:
                                                    resdata += ',' + finddata;
                                                    datacount++;
                                                    break;
                                            }
                                        }
                                } else {
                                    if (newromaname != null && romaforname != null)
                                        if (1 - (levenshtein(newromaname, romaforname) / romaforname.split(' ')[0].length) >= 0.77 || romaforname.indexOf(newromaname) != -1) {
                                            console.log("未切: " + newromaname + ", " + romaforname)
                                            //console.log("數量: " + levenshtein(newromaname, romaforname))
                                            console.log("分數: " + Number(1 - (levenshtein(newromaname, romaforname.split(' ')[0]) / romaforname.length)))
                                            var finddata = JSON.stringify(jsongetusers[j]);
                                            switch (datacount) {
                                                case 0: //第一筆資料
                                                    resdata += finddata;
                                                    datacount++;
                                                    break;
                                                default:
                                                    resdata += ',' + finddata;
                                                    datacount++;
                                                    break;
                                            }
                                        }
                                }
                            }

                        } else if (result[i][1] == "eng") {
                            var myAnswer = {
                                index: "",
                                answer: ""
                            }
                            myAnswer.index = result[i][0];
                            for (var j in jsongetusers) {
                                if ((jsongetusers[j].userPrincipalName).split("@")[0].toLowerCase().indexOf((myAnswer.index).toLowerCase()) != -1) {
                                    var finddata = JSON.stringify(jsongetusers[j]);
                                    switch (datacount) {
                                        case 0: //第一筆資料
                                            resdata += finddata;
                                            datacount++;
                                            break;
                                        default:
                                            resdata += ',' + finddata;
                                            datacount++;
                                            break;
                                    }
                                }
                            }
                        } else if (result[i][0] == "不" || result[i][0] == "不是" || result[i][0] == "不要" || result[i][0] == "取消" || result[i][0] == "不用" || result[i][0] == "不需要" || result[i][0] == "拜拜" || result[i][0] == "掰掰") {
                            res.send('cancel');
                            return;
                        }
                    }
                }
                if (datacount > 0) {
                    resdata = '[' + resdata + ']'; //最外面的 [ ]
                }
                //console.log(resdata);
                if (resdata != '') {
                    //console.log(datacount);
                    //console.log('!=null');
                    //console.log(resdata);
                    myAnswer.answer = resdata;
                    quickSearchData.push(myAnswer);
                    fs.writeFile('quickSearch.json', JSON.stringify(quickSearchData, null, 2), function () {
                        res.send(resdata);
                    })
                } else {
                    res.send('wrong');
                }
            }.bind({
                datacount: datacount
            }));
            /*
            var isEnglish = checkVal(searchdata);
            console.log(isEnglish)
            */
        }
    }
    //res.end();
})

app.post('/databoolean', function (req, res) {
    var resdata = '';
    console.log('POST /databoolean');
    var databoolean = req.body.databoolean;
    /*var nodejieba = require("nodejieba");
    nodejieba.load({
        userDict: __dirname + '/pages/checkboolean.utf8',
    });
    var boolean_result = nodejieba.tag(databoolean);
    console.log(boolean_result);*/
    var req = require('request');
    console.log('506'+typeof(databoolean));
    console.log('507'+databoolean);
    analyzer.pseg(databoolean, {
        mode: Jieba.mode.SEARCH,
        HMM: true
    }, function (err, result) {
        if (err) console.log(err)
        else {
            console.log('514'+typeof(result));
            console.log('515'+result);
            console.log(JSON.stringify(result));
            var datacount = 0;
            for (var i in result) {
                if (result[i][1] == "nr" || result[i][1] == "ng" || result[i][1] == "nrfg" || result[i][1] == "nrt" || result[i][1] == "nt" || result[i][1] == "nz") {
                    var myAnswer = {
                        index: "",
                        answer: ""
                    }
                    myAnswer.index = result[i][0];
                    var levenshtein = require('js-levenshtein');
                    newromaname = tranPinyin(result[i][0]);
                    console.log(newromaname);
                    for (var j = 0; j < jsongetusers.length; j++) {
                        romaforname = jsongetusers[j].romaname;
                        if (romaforname.split(' ').length >= 2) {
                            if (newromaname != null && romaforname != null)
                                if (1 - (levenshtein(newromaname, romaforname.split(' ')[0]) / romaforname.split(' ')[0].length) >= 0.77 || romaforname.indexOf(newromaname) != -1) {
                                    console.log("未切: " + newromaname + ", " + romaforname)
                                    //console.log("數量: " + levenshtein(newromaname, romaforname))
                                    console.log("分數: " + Number(1 - (levenshtein(newromaname, romaforname.split(' ')[0]) / romaforname.length)))
                                    var finddata = JSON.stringify(jsongetusers[j]);
                                    switch (datacount) {
                                        case 0: //第一筆資料
                                            resdata += finddata;
                                            datacount++;
                                            break;
                                        default:
                                            resdata += ',' + finddata;
                                            datacount++;
                                            break;
                                    }
                                }
                        } else {
                            if (newromaname != null && romaforname != null)
                                if (1 - (levenshtein(newromaname, romaforname) / romaforname.split(' ')[0].length) >= 0.77 || romaforname.indexOf(newromaname) != -1) {
                                    console.log("未切: " + newromaname + ", " + romaforname)
                                    //console.log("數量: " + levenshtein(newromaname, romaforname))
                                    console.log("分數: " + Number(1 - (levenshtein(newromaname, romaforname.split(' ')[0]) / romaforname.length)))
                                    var finddata = JSON.stringify(jsongetusers[j]);
                                    switch (datacount) {
                                        case 0: //第一筆資料
                                            resdata += finddata;
                                            datacount++;
                                            break;
                                        default:
                                            resdata += ',' + finddata;
                                            datacount++;
                                            break;
                                    }
                                }
                        }
                    }
                } else if (result[i][1] == "eng") {
                    var myAnswer = {
                        index: "",
                        answer: ""
                    }
                    myAnswer.index = result[i][0];
                    for (var j in jsongetusers) {
                        if (jsongetusers[j].userPrincipalName.split("@")[0].toLowerCase().indexOf((myAnswer.index).toLowerCase()) != -1) {
                            var finddata = JSON.stringify(jsongetusers[j]);
                            switch (datacount) {
                                case 0: //第一筆資料
                                    resdata += finddata;
                                    datacount++;
                                    break;
                                default:
                                    resdata += ',' + finddata;
                                    datacount++;
                                    break;
                            }
                        }
                    }
                } else if (result[i][1] == "m") {
                    var this_num = result[i][0];
                    switch (this_num) {
                        case "第一":
                            res.send("1");
                            break;
                        case "一個":
                            res.send("1");
                            break;
                        case "一筆":
                            res.send("1");
                            break;
                        case "第二":
                            res.send("2");
                            break;
                        case "第三":
                            res.send("3");
                            break;
                        case "第四":
                            res.send("4");
                            break;
                        case "第五":
                            res.send("5");
                            break;
                        case "第六":
                            res.send("6");
                            break;
                        case "第七":
                            res.send("7");
                            break;
                        case "第八":
                            res.send("8");
                            break;
                        case "第九":
                            res.send("9");
                            break;
                        case "10":
                            res.send("10");
                            break;
                        case "11":
                            res.send("11");
                            break;
                        case "12":
                            res.send("12");
                            break;
                        case "13":
                            res.send("13");
                            break;
                        case "14":
                            res.send("14");
                            break;
                        case "15":
                            res.send("15");
                            break;
                        case "16":
                            res.send("16");
                            break;
                        case "17":
                            res.send("17");
                            break;
                    }
                } else if (result[i][0] == "不" || result[i][0] == "不是" || result[i][0] == "不要" || result[i][0] == "取消" || result[i][0] == "不用" || result[i][0] == "不需要" || result[i][0] == "拜拜" || result[i][0] == "掰掰" || result[i][0] == "不好") {
                    res.send('cancel');
                    return;
                } else if (result[i][0] == "沒錯" || result[i][0] == "需要" || result[i][0] == "撥電話" || result[i][0] == "打電話" || result[i][0] == "好" || result[i][0] == "謝謝") {
                    res.send('makecall');
                    return;
                }
            }
            console.log('end');
            console.log(datacount);
            if (datacount > 0) {
                resdata = '[' + resdata + ']'; //最外面的 [ ]
            }
            console.log(resdata);
            if (resdata != '') {
                //console.log(datacount);
                //console.log('!=null');
                //console.log(resdata);
                myAnswer.answer = resdata;
                quickSearchData.push(myAnswer);
                fs.writeFile('quickSearch.json', JSON.stringify(quickSearchData, null, 2), function () {
                    console.log(resdata);
                    res.send(resdata);
                    return;
                })
            } else {
                res.send('wrong');
                return;
            }
        }
    });
})

function checkVal(str) {
    var regExp = /^[\d|a-zA-Z]+$/;
    if (regExp.test(str))
        return true;
    else
        return false;
}

var levenshtein = require('js-levenshtein');
var newromaname = "簡兆志"
var romaforname = "簡造字"
newromaname = tranPinyin(newromaname);
romaforname = tranPinyin(romaforname);
console.log(newromaname)
console.log(romaforname.split(' ')[0])
console.log("分數: " + Number(1 - (levenshtein(newromaname, romaforname.split(' ')[0]) / romaforname.length)))

function tranPinyin(text) {
    return pinyin(text, {
        style: pinyin.STYLE_NORMAL
    }).join('');
}
app.get('/images/tatungba.jpg', function (request, response) {
    var picture = request.params.picture;
    request.header("Content-Type", 'image/jpeg');
    fs.readFile(__dirname + '/images/tatungba.jpg', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({
        req: request,
        res: response
    }));
});

app.get('/images/tstiball.png', function (request, response) {
    var picture = request.params.picture;
    request.header("Content-Type", 'image/jpeg');
    fs.readFile(__dirname + '/images/tstiball.png', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({
        req: request,
        res: response
    }));
});

app.get('/images/night.jpg', function (request, response) {
    var picture = request.params.picture;
    request.header("Content-Type", 'image/jpeg');
    fs.readFile(__dirname + '/images/night.jpg', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({
        req: request,
        res: response
    }));
});

app.get('/images/flower.jpg', function (request, response) {
    var picture = request.params.picture;
    request.header("Content-Type", 'image/jpeg');
    fs.readFile(__dirname + '/images/flower.jpg', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({
        req: request,
        res: response
    }));
});

function resetQuickSearchData() {
    console.log("清除快取");
    quickSearchData = [];
    setTimeout(resetQuickSearchData, 86400 * 7)
}
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

// [ [ 'zhōng' ], [ 'xīn' ] ]
// [ [ 'zhōng', 'zhòng' ], [ 'xīn' ] ]