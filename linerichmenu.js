var fs = require('fs');
var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);

var linerichmenu = function (logger) {
    this.CreateRichMenu = function (richmenu, callback) {
        var RichMenuId = "";
        var data = {
            "size": {
                "width": 2500,
                "height": 1686
            },
            "selected": richmenu.selected,
            "name": richmenu.name,
            "chatBarText": richmenu.chatBarText,
            "areas": richmenu.areas
        }
        logger.info(JSON.stringify(data));
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/richmenu',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Content-Length': Buffer.byteLength(JSON.stringify(data)),
                'Authorization': 'Bearer <' + config.channel_access_token + '>'
            }
        };
        var https = require('https');
        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                logger.info('Response: ' + chunk);
                RichMenuId = RichMenuId + chunk;
            });
            res.on('end', function () {
                logger.info('Add RichMenu status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('Add RichMenu success');
                    this.callback(RichMenuId);
                } else {
                    logger.info('Add RichMenu failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.write(JSON.stringify(data));
        req.end();
    }

    this.DownloadRichMenuImage = function (richmenuId, callback) {
        var image = '';
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/richmenu/' + richmenuId + '/content',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer <' + config.channel_access_token + '>'
            }
        };
        var https = require('https');
        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                logger.info('Response: ' + chunk);
                image = image + chunk;
            });
            res.on('end', function () {
                logger.info('Get RichMenu Image status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('Get RichMenu Image success');
                    this.callback(image);
                } else {
                    logger.info('Get RichMenu Image failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.end();
    }

    this.GetAllRichMenu = function (callback) {
        var richmenulist = '';
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/richmenu/list',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer <' + config.channel_access_token + '>'
            }
        };
        var https = require('https');
        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                logger.info('Response: ' + chunk);
                richmenulist = richmenulist + chunk;
            });
            res.on('end', function () {
                logger.info('Get All RichMenu status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('Get All RichMenu success');
                    this.callback(richmenulist);
                } else {
                    logger.info('Get All RichMenu failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.end();
    }

    this.GetRichMenu = function (richmenuid, callback) {
        var richmenu = '';
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/richmenu/' + richmenuid,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer <' + config.channel_access_token + '>'
            }
        };
        var https = require('https');
        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                logger.info('Response: ' + chunk);
                richmenu = richmenu + chunk;
            });
            res.on('end', function () {
                logger.info('Get RichMenu status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('Get RichMenu success');
                    this.callback(richmenu);
                } else {
                    logger.info('Get RichMenu  failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.end();
    }

    this.DeleteRichMenu = function (richmenuid, callback) {
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/richmenu/' + richmenuid,
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer <' + config.channel_access_token + '>'
            }
        };
        var https = require('https');
        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                logger.info('Response: ' + chunk);
            });
            res.on('end', function () {
                logger.info('Get RichMenu status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('Get RichMenu success');
                    this.callback(true);
                } else {
                    logger.info('Get RichMenu  failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.end();
    }

    this.SetDefaultRichMenu = function (richmenuid, callback) {
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/user/all/richmenu/' + richmenuid,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer <' + config.channel_access_token + '>'
            }
        };
        var https = require('https');
        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                logger.info('Response: ' + chunk);
            });
            res.on('end', function () {
                logger.info('Set Default RichMenu status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('Set Default RichMenu success');
                    this.callback(true);
                } else {
                    logger.info('Set Default RichMenu  failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.end();
    }

    this.LinkRichMenuToUser = function (userid, richmenuid, callback) {
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/user/'+ userid +'/richmenu/' + richmenuid,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer <' + config.channel_access_token + '>'
            }
        };
        var https = require('https');
        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                logger.info('Response: ' + chunk);
            });
            res.on('end', function () {
                logger.info('Link RichMenu To User status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('Link RichMenu To User success');
                    this.callback(true);
                } else {
                    logger.info('Link RichMenu To User  failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.end();
    }
}

exports.linerichmenu = linerichmenu;