var tentative_activity = new Map();

// Application Log
var log4js = require('log4js');
var log4js_extend = require('log4js-extend');
log4js_extend(log4js, {
    path: __dirname,
    format: '(@file:@line:@column)'
});
log4js.configure(__dirname + '/log4js.json');
var logger = log4js.getLogger('bot');
var logger_line_message = log4js.getLogger('line_message');
var logger_line_LIFF = log4js.getLogger('line_LIFF');
var logger_line_RichMenu = log4js.getLogger('line_RichMenu');

// 連接 mongodb
var linemongodb = require('./linemongodb');
var linedb = new linemongodb.linemongodb();

// line Message API
var linemessageapi = require('./linemessage');
var linemessage = new linemessageapi.linemessage(logger_line_message);

// line LIFF API
var lineliffapi = require('./lineliff');
var lineliff = new lineliffapi.lineliff(logger_line_LIFF);

//line Flex API
var lineflexapi = require('./lineflex');
var lineflex = new lineflexapi.lineflex();

var linerichmenuapi = require('./linerichmenu');
var linerichmenu = new linerichmenuapi.linerichmenu(logger_line_RichMenu);

// 建立 express service
var express = require('express');
var app = express();
var port = process.env.PORT || 443;
var http = require('http');
var server = http.Server(app).listen(port);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));

// 讀取組態表
var fs = require('fs');
var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);

function user() {
    this.name = '';
    this.userid = '';
    this.image = '';
    this.location = [];
    this.pushenable = true;
}

function location() {
    this.name = '';
    this.locationid = '';
    this.user = [];
    this.latitude = '';
    this.longitude = '';
}

function shuangjiou() {
    this.name = '';
    this.description = '';
    this.starttime = '';
    this.endtime = '';
    this.type = '';
    this.host = '';
    this.location = '';
    this.latitude = '';
    this.longitude = '';
    this.number = '';
    this.participant = [];
    this.shuangjiouid = '';
}

function host() {
    this.shuangjiouid = '';
    this.name = '';
    this.userid = '';
    this.gender = '';
    this.clothes = '';
    this.hat = '';
    this.location = '';
}

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
});

app.get('/api', function (request, response) {
    response.send('API is running');
});

app.get('/api/richmenulist', function (request, response) {
    linerichmenu.GetAllRichMenu(function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.get('/api/richmenu/:richmenuid', function (request, response) {
    var richmenuid = request.params.richmenuid;
    linerichmenu.GetRichMenu(richmenuid, function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.post('/api/richmenu', function (request, response) {
    var richmenu = request.body.richmenu;
    linerichmenu.CreateRichMenu(richmenu, function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.get('/api/richmenulist', function (request, response) {
    linerichmenu.GetAllRichMenu(function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.get('/api/richmenu/:richmenuid', function (request, response) {
    var richmenuid = request.params.richmenuid;
    linerichmenu.GetRichMenu(richmenuid, function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.post('/api/richmenu', function (request, response) {
    var richmenu = request.body.richmenu;
    linerichmenu.CreateRichMenu(richmenu, function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.delete('/api/richmenu/:richmenu', function (request, response) {
    var richmuneId = request.params.richmenuid;
    linerichmenu.DeleteRichMenu(richmuneId, function (result) {
        if (result) response.send(true);
        else response.send(false);
    });
});

app.put('/api/richmenu/defaultrichmenu', function (request, response) {
    var richmenuId = request.body.richmenuid;
    linerichmenu.SetDefaultRichMenu(richmenuId, function (result) {
        if (result) response.send(true);
        else response.send(false);
    });
});

app.put('/api/richmenu/link', function (request, response) {
    var userId = request.body.userid;
    var richmenuId = request.body.richmenuid;
    linerichmenu.LinkRichMenuToUser(userId, richmenuId, function (result) {
        if (result) response.send(true);
        else response.send(false);
    });
});

app.get('/api/liff', function (request, response) {
    lineliff.GetAllLIFF(function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.post('/api/liff', function (request, response) {
    var url = request.body.url;
    lineliff.AddLIFF(url, function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.put('/api/liff', function (request, response) {
    var LIFF_ID = request.body.liff;
    var url = request.body.url;
    lineliff.UpdateLIFF(LIFF_ID, url, function (result) {
        if (result) response.send(true);
        else response.send(false);
    });
});

app.delete('/api/liff/:liff', function (request, response) {
    var LIFF_ID = request.params.liff;
    lineliff.DeleteLIFF(LIFF_ID, function (result) {
        if (result) response.send(true);
        else response.send(false);
    });
});

app.post('/api/beacon', function (request, response) {
    var beacon = new location();
    beacon.name = request.body.name;
    beacon.locationid = request.body.beacon_id;
    linedb.create_location(beacon, function (err, hosts) {
        if (err) {
            logger.info('create beacon fail: ' + err);
            response.send('create beacon fail: ' + err);
        }
        logger.info('create beacon success');
        response.send(hosts);
    });
});

app.post('/api/shungjiou', function (request, response) {
    logger.info('POST /api/shungjiou');
    logger.info(JSON.stringify(request.body));
    var data = request.body;
    data.host.userId = data.host.userId.replace('\"', '').replace('\"', '');
    if (tentative_activity.has(data.host.userId)) {
        var activity = tentative_activity.get(data.host.userId);
        activity.name = data.shuangjiou.name;
        activity.description = data.shuangjiou.description;
        activity.starttime = Date.now();
        activity.endtime = new Date(data.shuangjiou.endtime);
        activity.type = data.shuangjiou.type;
        activity.host = data.host.userId;
        activity.number = data.shuangjiou.number;
        activity.fare = data.shuangjiou.fare;
        linedb.create_shuangjiou(activity, function (err) {
            if (err)
                logger.error('fail: ' + err);
            else
                logger.info('success');
        });

        var organiser = new host();

        organiser.name = data.host.name;
        organiser.userid = data.host.userId;
        organiser.gender = data.host.gender;
        organiser.clothes = data.host.clothes;
        organiser.hat = data.host.hat;
        organiser.shuangjiouid = activity.shuangjiouid;
        linedb.create_host(organiser, function (err) {
            if (err)
                logger.error('fail: ' + err);
            else
                logger.info('success');
        });
        var buttons = [
            {
                "type": "uri",
                "label": "查看成員",
                "uri": "line://app/1610735667-3E0z5w6a"
            }
        ]
        linemessage.SendButtons(data.host.userId, "您的活動已建立，可以點選以下按鈕查看參加者", buttons, "This is a button", "linehack2018", "", function (result) {
            if (!result) logger.error(result);
            else logger.info(result);
        });
        response.send('200');
    }
});

app.post('/api/guest', function (request, response) {
    var userId = request.body.userId;
    userId = userId.split('"')[1];
    logger.info(userId);
    linedb.get_shuangjioubyhost(userId, function (err, host) {
        if (err) {
            logger.info('fail: ' + err);
            this.res.send(err);
        }
        else {
            logger.info('success');
            logger.info(host);
            if (host != null && host.participant) {
                linedb.get_usersbyuserids(host.participant, function (err, user) {
                    if (err) {
                        logger.info('fail: ' + err);
                    }
                    else {
                        logger.info('success');
                        logger.info(user);
                        this.res.send(user);
                    }
                }.bind({ res: this.res }));
            } else {
                this.res.send('');
            }
        }
    }.bind({ res: response }));
});

app.post('/api/finish', function (request, response) {
    var userId = request.body.userId;
    userId = userId.split('"')[1];
    if (tentative_activity.has(userId));
    tentative_activity.delete(userId);
    linedb.delete_hostbyuserid(userId, function (err, host) {
        if (err) {
            logger.info('fail: ' + err);
        }
        else {
            logger.info('success');
        }
    });
    linedb.delete_shuangjioubyhost(userId, function (err, shuangjiou) {
        if (err) {
            logger.info('fail: ' + err);
        }
        else {
            logger.info('success');
        }
    });
    linemessage.SendMessage(userId, "活動已完成，感謝您的使用!", "linehack2018", '', function (result) {
        if (!result) logger.error(result);
        else {
            logger.info(result);
            this.response.send('200');
        }
    }.bind({ response: response }));
});

app.use(express.static('pages'));
app.get('/index', function (request, response) {
    console.log('GET /index');
    var fs = require('fs');
    request.header("Content-Type", 'text/html');
    fs.readFile(__dirname + '/pages/index.html', 'utf8', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

app.get('/member', function (request, response) {
    console.log('GET /member');
    var fs = require('fs');
    request.header("Content-Type", 'text/html');
    fs.readFile(__dirname + '/pages/member.html', 'utf8', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

app.get('/map/:location', function (request, response) {
    var location = request.params.location;
    var lat = location.split(',')[0];
    var lng = location.split(',')[1];
    console.log('GET /member');
    var fs = require('fs');
    request.header("Content-Type", 'text/html');
    fs.readFile(__dirname + '/pages/map.html', 'utf8', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        data = data +
            '<script type="text/javascript"> var lat = "' + lat+ '"; </script>'
            + '<script type="text/javascript"> var lng = '+lng + ';</script>'
        this.res.send(data);
    }.bind({ req: request, res: response }));
});
app.post("/index", function (req, res, next) {
    res.render("registOK");
});

app.use(express.static('resource'));

app.get('/image/:picture', function (request, response) {
    var picture = request.params.picture;
    request.header("Content-Type", 'image/jpeg');
    fs.readFile(__dirname + '/resource/' + picture, function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

app.get('/image/location.jpg/1040', function (request, response) {
    var picture = request.params.picture;
    request.header("Content-Type", 'image/jpeg');
    fs.readFile(__dirname + '/resource/location.jpg', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

var user_flag = new Map();
var userActivityType = new Map();
// 接收來自 LINE 傳送的訊息
app.post('/', function (request, response) {
    logger.info("POST /");
    try {
        var results = request.body.events;
        logger.info(JSON.stringify(results));
        logger.info('receive message count: ' + results.length);
        for (var idx = 0; idx < results.length; idx++) {
            if (user_flag.get(results[idx].source.userId) == "location") {
                if (results[idx].message.type != "location") {
                    linemessage.SendMessage(results[idx].source.userId, "未輸入位置訊息，請重新操作一次", 'linehack2018', results[idx].replyToken, function (result) {
                        if (!result) logger.error(result);
                        else logger.info(result);
                    });
                }
                else {
                    logger.info("get location..........................................");
                    manual_seearch(userActivityType.get(results[idx].source.userId), results[idx].message.latitude, results[idx].message.longitude, results[idx].source.userId, results[idx].replyToken, function (user_id, replyToken, shuangjious, reg) {
                        if (reg) {
                            if (shuangjious.length == 0) {
                                let quickreply = {
                                    "items": [
                                        {
                                            "type": "action",
                                            "action": {
                                                "type": "postback",
                                                "label": "創團",
                                                "data": "action=createactivity"
                                            }
                                        }
                                    ]
                                }
                                linemessage.SendMessageAndQuickReply(user_id, "目前沒有活動喔，要不要自己創一個?", 'linehack2018', replyToken, quickreply, function (result) {
                                    if (!result) logger.error(result);
                                    else logger.info(result);
                                });
                            }
                            else {
                                let flexs = lineflex.CreateActivityFlexCarousel(shuangjious);
                                linemessage.SendMessage(user_id, "以下是1公里內最近的5個活動", 'linehack2018', replyToken, function (result) {
                                    if (!result) logger.error(result);
                                    else {
                                        logger.info(result);
                                        linemessage.SendFlex(user_id, flexs, 'linehack2018', replyToken, function (result) {
                                            if (!result) {
                                                logger.error('fail: ' + result);
                                            }
                                            else {
                                                logger.info('success');
                                            }
                                        });
                                    }
                                });

                            }
                        }
                        userActivityType.delete(user_id)
                    });
                }
                user_flag.delete(results[idx].source.userId)
            }
            else if (user_flag.get(results[idx].source.userId) == "type") {
                if (results[idx].message.type != "text") {
                    linemessage.SendMessage(results[idx].source.userId, "未輸入活動類型，請重新操作一次", 'linehack2018', results[idx].replyToken, function (result) {
                        if (!result) logger.error(result);
                        else logger.info(result);
                    });
                }
                else {
                    let quickreply = {
                        "items": [
                            {
                                "type": "action",
                                "action": {
                                    "type": "location",
                                    "label": "location",
                                }
                            }
                        ]
                    }
                    linemessage.SendMessageAndQuickReply(results[idx].source.userId, "請輸入位置資訊", 'linehack2018', results[idx].replyToken, quickreply, function (result) {
                        if (!result) logger.error(result);
                        else logger.info(result);
                    });
                    user_flag.set(results[idx].source.userId, "location")
                    userActivityType.set(results[idx].source.userId, results[idx].message.text)
                }
            } else {
                var acct = results[idx].source.userId;
                var reply_token = results[idx].replyToken;
                logger.info('reply token: ' + results[idx].replyToken);
                logger.info('createdTime: ' + results[idx].timestamp);
                logger.info('from: ' + results[idx].source.userId);
                logger.info('type: ' + results[idx].type);
                if (results[idx].type == 'follow') {
                    FollowEvent(acct);
                }
                else if (results[idx].type == 'beacon') {    // 接收到使用者的 Beacon 事件
                    BeanconEvent(results[idx]);
                }
                else if (results[idx].type == 'message') {
                    if (results[idx].message.type == 'location') {
                        logger.info('緯度: ' + results[idx].message.latitude);
                        logger.info('經度: ' + results[idx].message.longitude);
                        logger.info(JSON.stringify(results[idx].type));
                        logger.info(tentative_activity.has(results[idx].source.userId));
                        if (tentative_activity.has(results[idx].source.userId)) {
                            logger.info('activity: ' + results[idx].source.userId);
                            var activity = tentative_activity.get(results[idx].source.userId);
                            activity.latitude = results[idx].message.latitude;
                            activity.longitude = results[idx].message.longitude;
                            tentative_activity.set(results[idx].source.userId, activity);
                            var buttons = [
                                {
                                    "type": "uri",
                                    "label": "填寫活動詳細資訊",
                                    "uri": "line://app/1610735667-PqWkJG9O"
                                }
                            ]
                            linemessage.SendButtons(results[idx].source.userId, "請點選以下按鈕，輸入活動細節", buttons, "This is a button", "linehack2018", results[idx].replyToken, function (result) {
                                if (!result) logger.error(result);
                                else logger.info(result);
                            });
                        }
                    }

                } else if (results[idx].type == 'postback') {
                    var action = results[idx].postback.data.split('=')[1];
                    logger.info('回傳使用者執行動作: ' + action);
                    if (action == 'createactivity') {
                        var activity = new shuangjiou();
                        linedb.get_shuangjioubyhost(results[idx].source.userId, function (err, step_activity) {
                            logger.info(step_activity);
                            if (step_activity) {
                                activity.shuangjiouid = step_activity.shuangjiouid;
                                activity.name = step_activity.name;
                                activity.description = step_activity.description;
                                activity.starttime = step_activity.starttime;
                                activity.endtime = step_activity.endtime;
                                activity.type = step_activity.type;
                                activity.host = step_activity.host;
                                activity.number = step_activity.number;
                                activity.fare = step_activity.fare;
                                activity.latitude = step_activity.latitude;
                                activity.longitude = step_activity.longitude;
                                this.tentative_activity.set(this.results.source.userId, activity);
                            }
                            logger.info(this.tentative_activity.has(this.results.source.userId));
                            if (this.tentative_activity.has(this.results.source.userId)) {
                                var buttons = [
                                    {
                                        "type": "uri",
                                        "label": "查看成員",
                                        "uri": "line://app/1610735667-3E0z5w6a"
                                    }
                                ]
                                linemessage.SendButtons(this.results.source.userId, "不好意思，您還有一個活動還未結束，請結束後在建立新的活動", buttons, "This is a button", "linehack2018", this.results.replyToken, function (result) {
                                    if (!result) logger.error(result);
                                    else logger.info(result);
                                });
                            } else {
                                activity.shuangjiouid = guid();
                                this.tentative_activity.set(this.results.source.userId, activity);
                                var imagemap = [
                                    {
                                        "type": "uri",
                                        "linkUri": "line://nv/location",
                                        "area": {
                                            "x": 0,
                                            "y": 0,
                                            "width": 1040,
                                            "height": 1040
                                        }
                                    }
                                ]
                                linemessage.SendImagemap(this.results.source.userId, "https://linehack2018.azurewebsites.net/image/location.jpg", "This is an imagemap", imagemap, 'linehack2018', this.results.replyToken, function (result) {
                                    if (!result) logger.error(result);
                                    else logger.info(result);
                                });
                            }
                        }.bind({ results: results[idx], tentative_activity: tentative_activity }));
                    } else if (action == 'searchactivity') {
                        logger.info("搜尋揪團..............................");
                        user_flag.set(results[idx].source.userId, "type")
                        let quickreply = {
                            "items": [
                                {
                                    "type": "action",
                                    "action": {
                                        "type": "message",
                                        "label": "飲食",
                                        "text": "eat"
                                    }
                                },
                                {
                                    "type": "action",
                                    "action": {
                                        "type": "message",
                                        "label": "購物",
                                        "text": "sale"
                                    }
                                },
                                {
                                    "type": "action",
                                    "action": {
                                        "type": "message",
                                        "label": "旅行",
                                        "text": "sleep"
                                    }
                                },
                                {
                                    "type": "action",
                                    "action": {
                                        "type": "message",
                                        "label": "不設限",
                                        "text": "不設限"
                                    }
                                }
                            ]
                        }
                        linemessage.SendMessageAndQuickReply(results[idx].source.userId, "請選擇活動類別", 'linehack2018', results[idx].replyToken, quickreply, function (result) {
                            if (!result) logger.error(result);
                            else logger.info(result);
                        });
                    } else if (action == 'isactiveactivity') {
                        var buttons = [
                            {
                                "type": "postback",
                                "label": "Yes",
                                "data": "action=setbeaconon"
                            },
                            {
                                "type": "postback",
                                "label": "No",
                                "data": "action=setbeaconoff"
                            }
                        ]
                        linemessage.SendConfirm(results[idx].source.userId, '請問您想要在經過beacon時，收到活動資訊嗎?', buttons, 'this is a confirm', 'linehack2018', results[idx].replyToken, function (result) {
                            if (!result) logger.error(result);
                            else logger.info(result);
                        });
                    } else if (action == 'setbeaconon') {
                        linedb.set_pushenablebyuserid(results[idx].source.userId, true, function (err) {
                            if (!err) logger.error(err);
                            else err.info(err);
                        });
                        linemessage.SendMessage(results[idx].source.userId, '您已將活動通知開啟', 'linehack2018', results[idx].replyToken, function (result) {
                            if (!result) logger.error(result);
                            else logger.info(result);
                        });
                    } else if (action == 'setbeaconoff') {
                        linedb.set_pushenablebyuserid(results[idx].source.userId, false, function (err) {
                            if (!err) logger.error(err);
                            else err.info(err);
                        });
                        linemessage.SendMessage(results[idx].source.userId, '您已將活動通知關閉', 'linehack2018', results[idx].replyToken, function (result) {
                            if (!result) logger.error(result);
                            else logger.info(result);
                        });
                    }
                    else if (action == 'leaveActivity') {
                        linedb.get_shuangjious(function (err, shuangjious) {
                            for (var i in shuangjious) {
                                for (var j in shuangjious[i].participant) {
                                    if (shuangjious[i].participant[j] == this.user_id) {
                                        shuangjious[i].participant.splice(j, 1)
                                    }
                                }
                                linedb.set_participanttbyhuangjiouid(this.user_id, shuangjious[i].shuangjiouid, shuangjious[i].participant, function () {

                                })
                            }
                            linemessage.SendMessage(this.user_id, "已退出所有活動", "linehack2018", this.replyToken, function (result) {
                                if (!result) logger.error(result);
                                else logger.info(result);
                            });
                        }.bind({ user_id: results[idx].source.userId, replyToken: results[idx].replyToken }))

                    }
                    else {
                        logger.info('準備加入活動: ' + action);
                        linedb.get_shuangjioubyshuangjiouid(action, function (err, shuangjious) {
                            logger.info(JSON.stringify(shuangjious))
                            shuangjious[0].participant.push(this.user_id);//
                            logger.info(JSON.stringify(shuangjious[0].participant))
                            linedb.set_participanttbyhuangjiouid(this.user_id, this.action, shuangjious[0].participant, function (user_id) {
                                let quickreply = {
                                    "items": [
                                        {
                                            "type": "action",
                                            "action": {
                                                "type": "postback",
                                                "label": "我要退團",
                                                "data": "action=leaveActivity"
                                            }
                                        }
                                    ]
                                }
                                linemessage.SendMessageAndQuickReply(user_id, "加入活動成功，爽主資料: " + this.description, "linehack2018", this.replyToken, quickreply, function (result) {
                                    if (!result) logger.error(result);
                                    else logger.info(result);
                                });
                            }.bind({ replyToken: this.replyToken, description: shuangjious[0].description }))
                        }.bind({ user_id: results[idx].source.userId, replyToken: results[idx].replyToken, action: action }))
                        //
                    }
                }
            }
        }
    } catch (e) {
    }
    response.send('');
});
function manual_seearch(activity_type, lat, lng, user_id, replyToken, callback) {

    logger.info("manual_seearch: ......................................")
    var location_compare = [];
    linedb.get_shuangjious(function (err,shuangjious) {
        logger.info("shuangjious: " + JSON.stringify(shuangjious, null, 2))
        for (var idx = 0; idx < shuangjious.length; idx++) {
            logger.info(idx + " :距離: " + linedb.getdistance(Number(shuangjious[idx].latitude), Number(shuangjious[idx].longitude), Number(lat), Number(lng)))
            if (shuangjious[idx].latitude != null && shuangjious[idx].longitude != null) {
                if (linedb.getdistance(Number(shuangjious[idx].latitude), Number(shuangjious[idx].longitude), Number(lat), Number(lng)) < 1000) {
                    if (activity_type == "不設限") {
                        logger.info("activity_type : " + activity_type)
                        if (location_compare.length == 0) {
                            location_compare.push(shuangjious[idx])
                        }
                        else {
                            for (var idy = 0; idy < location_compare.length; idy++) {
                                logger.info(idy + " : " + JSON.stringify(location_compare, null, 2))

                                if (linedb.getdistance(Number(shuangjious[idx].latitude), Number(shuangjious[idx].longitude), Number(lat), Number(lng)) <=
                                    linedb.getdistance(Number(location_compare[idy].latitude), Number(location_compare[idy].longitude), Number(lat), Number(lng))) {
                                    logger.info("爽揪<location_compare")
                                    for (var idz = location_compare.length; idz > idy; idz--) {
                                        location_compare[idz] = location_compare[idz - 1];
                                    }
                                    location_compare[idy] = shuangjious[idx];
                                    logger.info("新增在location_compare: 位置" + idy + ".....................")
                                    logger.info(idy + " : " + JSON.stringify(location_compare, null, 2))
                                    break;
                                }
                                logger.info("新增在location_compare最後面.....................")
                                if (idy == location_compare.length - 1) {
                                    location_compare.push(shuangjious[idx])
                                    break;
                                }

                            }
                        }
                    }
                    else {
                        logger.info("activity_type : " + activity_type)
                        if (shuangjious[idx].type == activity_type) {
                            if (location_compare.length == 0) {
                                location_compare.push(shuangjious[idx])
                            }
                            else {
                                for (var idy = 0; idy < location_compare.length; idy++) {
                                    logger.info(idy + " : " + JSON.stringify(location_compare, null, 2))
                                    if (linedb.getdistance(Number(shuangjious[idx].latitude), Number(shuangjious[idx].longitude), Number(lat), Number(lng)) <=
                                        linedb.getdistance(Number(location_compare[idy].latitude), Number(location_compare[idy].longitude), Number(lat), Number(lng))) {
                                        logger.info("爽揪<location_compare")
                                        for (var idz = location_compare.length; idz > idy; idz--) {
                                            location_compare[idz] = location_compare[idz - 1];
                                        }
                                        location_compare[idy] = shuangjious[idx];
                                        logger.info("新增在location_compare: 位置" + idy + ".....................")
                                        logger.info(idy + " : " + JSON.stringify(location_compare, null, 2))
                                        break;
                                    }
                                    if (idy == location_compare.length - 1) {
                                        logger.info("新增在location_compare最後面.....................")
                                        location_compare.push(shuangjious[idx])
                                        break;
                                    }
                                }
                            }

                        }

                    }
                }
            }
        }
        logger.info("location_compare結果: " + JSON.stringify(location_compare, null, 2))
        callback(user_id, replyToken, location_compare, true)
    })

}
function FollowEvent(acct) {
    logger.info('----------[Follow]---------');
    var new_user = new user();
    linemessage.GetProfile(acct, function (user) {
        this.new_user.name = user.displayName;
        this.new_user.userid = user.userId;
        this.new_user.image = user.pictureUrl;
        linedb.create_user(this.new_user, function (err) {
            if (err) logger.error('fail' + err);
            else logger.info('success');
        });
    }.bind({ new_user: new_user }));
}

function BeanconEvent(event) {
    logger.info('----------[Beacon]---------');
    logger.info('source: ' + JSON.stringify(event.source));
    logger.info('beacon: ' + JSON.stringify(event.beacon));
    logger.info('beacon type: ' + event.beacon.type);
    switch (event.beacon.type) {
        case "enter":
            var update_user = new user();
            linemessage.GetProfile(event.source.userId, function (user) {
                this.update_user.name = user.displayName;
                this.update_user.userid = user.userId;
                this.update_user.image = user.pictureUrl;
                this.update_user.location.push(event.beacon.hwid);
                this.update_user.pushenable = user.pushenable;
                linedb.set_userbyuserid(this.update_user.userid, this.update_user, function (err) {
                    if (err) logger.error('fail' + err);
                    else logger.info('success');
                });
            }.bind({ update_user: update_user }));
            linedb.enter_usertolocation(event.source.userId, event.beacon.hwid, function (err) {
                if (err) logger.error(err);
            });

            //取得此user是否要推揪團訊息
            linedb.get_userbyuserid(event.source.userId, function (err, user) {
                if (err) logger.error('fail' + err);
                else
                    if (user.pushenable) {
                        //取得此Beacon位置訊息
                        linedb.get_locationbyid(this.hwid, function (err, location) {
                            if (err) logger.error('fail' + err);
                            else {
                                let lat = location.latitude;
                                let lon = location.longitude;
                                //取得所有揪團資訊
                                linedb.get_shuangjious(function (err, shuangjious) {
                                    if (err) logger.error('fail' + err);
                                    else {
                                        let data = [];
                                        for (let i = 0; i < shuangjious.length; i++) {
                                            //判斷揪團距離
                                            if (linedb.getdistance(shuangjious[i].latitude, shuangjious[i].longitude, this.lat, this.lon) < 500) {
                                                data.push(shuangjious[i]);
                                            }
                                        }
                                        let flex = lineflex.CreateActivityFlexCarousel(data);
                                        linemessage.SendFlex(this.userid, flex, 'linehack2018', '', function (result) {
                                            if (!result) {
                                                logger.error('fail: ' + result);
                                            }
                                            else {
                                                logger.info('success');
                                            }
                                        });
                                    }
                                }.bind({ lat: lat, lon: lon, userid: this.userid }));
                            }
                        }.bind({ userid: user.userid }));
                    }
            }.bind({ hwid: event.beacon.hwid, userid: event.source.userId }));
            break;
    }
}

function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
