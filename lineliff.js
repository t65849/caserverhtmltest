var fs = require('fs');
var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);
var lineliff = function (logger) {
    this.AddLIFF = function (url, callback) {
        var LIFF_ID = '';
        var data = {
            "view": {
                "type": "tall",
                "url": url
            }
        }
        logger.info(JSON.stringify(data));
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/liff/v1/apps',
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
                LIFF_ID = LIFF_ID + chunk;
            });
            res.on('end', function () {
                logger.info('Add LIFF status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('Add LIFF success');
                    this.callback(LIFF_ID);
                } else {
                    logger.info('Add LIFF failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.write(JSON.stringify(data));
        req.end();
    }

    this.UpdateLIFF = function (LIFF_ID, url, callback) {
        var data = {
            "type": "tall",
            "url": url
        }
        logger.info(JSON.stringify(data));
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/liff/v1/apps/' + LIFF_ID + '/view',
            method: 'PUT',
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
            });
            res.on('end', function () {
                logger.info('Update LIFF status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('Update LIFF success');
                    this.callback(true);
                } else {
                    logger.info('Update LIFF failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.write(JSON.stringify(data));
        req.end();
    }

    this.GetAllLIFF = function (callback) {
        var data = '';
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/liff/v1/apps',
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
                data = data + chunk;
            });
            res.on('end', function () {
                logger.info('Update LIFF status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('GET ALL LIFF success');
                    this.callback(data);
                } else {
                    logger.info('GET ALL LIFF failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.end();
    }

    this.DeleteLIFF = function (LIFF_ID, callback) {
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/liff/v1/apps/' + LIFF_ID,
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
                logger.info('DELETE LIFF status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    logger.info('DELETE LIFF success');
                    this.callback(true);
                } else {
                    logger.info('DELETE LIFF failure');
                    this.callback(false);
                }
            }.bind({ callback: this.callback }));
        }.bind({ callback: callback }));
        req.end();
    }
}
exports.lineliff = lineliff;