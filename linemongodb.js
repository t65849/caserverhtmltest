
var linemongodb = function () {
    this.mongoose = require('mongoose');
    this.ShuangJiou = require('./models/shuangjiou');
    this.Host = require('./models/host');
    this.User = require('./models/user');
    this.Location = require('./models/location');
    this.dbConnectPath = 'mongodb+srv://tsti:70771557@cluster0-k85ga.gcp.mongodb.net/LINE?retryWrites=true';
    this.mongoose.connect(this.dbConnectPath, { useNewUrlParser: true });

    //ShuangJiou
    //建立爽揪資訊
    this.create_shuangjiou = function (shuangjiou, callback) {
        console.log('create_shuangjiou: shuangjiou=' + JSON.stringify(shuangjiou));

        /*
        let shuangjiou = {};
        shuangjiou.shuangjiouid = 'Idxxxx1';
        shuangjiou.name = '爽揪';
        shuangjiou.description = '爽揪';
        shuangjiou.time = Date.now();
        shuangjiou.type = '吃';
        shuangjiou.location = 'Bxxxxxxxx1';
        shuangjiou.latitude = '25.0805773';
        shuangjiou.longitude = '121.565819';
        shuangjiou.host = 'Uxxxxxxxx1';
        shuangjiou.number = '999';
        shuangjiou.member = '';
        */

        this.ShuangJiou.findOneAndUpdate({ 'shuangjiouid': shuangjiou.shuangjiouid }, shuangjiou, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou saved successfully');
                callback(null);
            }
        });

        /*
        let addShuangJiou = new this.ShuangJiou(shuangjiou);
        addShuangJiou.save(function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou saved successfully');
                callback(null);
            }
        });
        */
    }

    //根據名稱取得爽揪資訊
    this.get_shuangjioubyname = function (name, callback) {
        console.log('get_shuangjioubyname: name=' + name);

        this.ShuangJiou.find({ 'name': name }, function (err, shuangjious) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou get successfully');
                if (shuangjious)
                    callback(null, shuangjious);
                else
                    callback(null, null);
            }
        });
    }

    //根據主辦人取得爽揪資訊
    this.get_shuangjioubyhost = function (host, callback) {
        console.log('get_shuangjioubybeacon: host=' + host);

        this.ShuangJiou.findOne({ 'host': host }, function (err, shuangjiou) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou get successfully');
                if (shuangjiou)
                    callback(null, shuangjiou);
                else
                    callback(null, null);
            }
        });
    }

    //根據Id取得爽揪資訊
    this.get_shuangjioubyshuangjiouid = function (shuangjiouid, callback) {
        console.log('get_shuangjioubyid: shuangjiouid=' + shuangjiouid);

        this.ShuangJiou.find({ 'shuangjiouid': shuangjiouid }, function (err, shuangjious) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou get successfully');
                if (shuangjious)
                    callback(null, shuangjious);
                else
                    callback(null, null);
            }
        });
    }
    //根據Id更新參加人物資訊
    this.set_participanttbyhuangjiouid = function (userid, shuangjiouid, participant, callback) {
        console.log('set_participanttbyhuangjiouid' + shuangjiouid + ' participant=' + JSON.stringify(participant));

        this.ShuangJiou.updateOne({ 'shuangjiouid': shuangjiouid }, { $set: { "participant": participant } }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('participant update successfully');
                callback(userid);
            }
        });
    }
    //根據BeaconId取得爽揪資訊
    this.get_shuangjioubylocation = function (location, callback) {
        console.log('get_shuangjioubybeacon: location=' + location);

        this.ShuangJiou.find({ 'location': location }, function (err, shuangjious) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou get successfully');
                if (shuangjious)
                    callback(null, shuangjious);
                else
                    callback(null, null);
            }
        });
    }

    //根據揪團名稱更新爽揪資訊
    this.set_shuangjioubyname = function (name, shuangjiou, callback) {
        console.log('set_shuangjioubyname: name=' + name + ' shuangjiou=' + JSON.stringify(shuangjiou));

        this.ShuangJiou.updateOne({ 'name': name }, shuangjiou, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou update successfully');
                callback(null);
            }
        });
    }

    //根據揪團ID加入參加者
    this.add_shuangjiouuserbyid = function (shuangjiouid, userid, callback) {
        console.log('add_shuangjiouuserbyid: shuangjiouid=' + shuangjiouid + ' userid=' + userid);

        this.ShuangJiou.updateOne({ 'shuangjiouid': shuangjiouid }, { $addToSet: { 'participant': userid }}, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou add user successfully');
                callback(null);
            }
        });
    }

    //根據揪團ID刪除參加者
    this.remove_shuangjiouuserbyid = function (shuangjiouid, userid, callback) {
        console.log('remove_shuangjiouuserbyid: shuangjiouid=' + shuangjiouid + ' userid=' + userid);

        this.ShuangJiou.updateOne({ 'shuangjiouid': shuangjiouid }, { $pull: { 'participant': userid }}, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou remove user successfully');
                callback(null);
            }
        });
    }

    //根據揪團名稱刪除爽揪資訊
    this.delete_shuangjioubyname = function (name, callback) {
        console.log('delete_shuangjioubyname: name=' + name);

        this.ShuangJiou.deleteOne({ 'name': name }, shuangjiou, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou delete successfully');
                callback(null);
            }
        });
    }

    //根據揪團團主刪除爽揪資訊
    this.delete_shuangjioubyhost = function (host, callback) {
        console.log('delete_shuangjioubyhost: host=' + host);

        this.ShuangJiou.deleteOne({ 'host': host }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou delete successfully');
                callback(null);
            }
        });
    }

    //取得所有揪團資訊
    this.get_shuangjious = function (callback) {
        console.log('get_shuangjious');

        this.ShuangJiou.find(function (err, shuangjious) {
            if (err) {
                callback(err);
            }
            else {
                console.log('ShuangJiou get successfully');
                if (shuangjious)
                    callback(null, shuangjious);
                else
                    callback(null, null);
            }
        });
    }

    //Host
    //建立爽主資訊
    this.create_host = function (host, callback) {
        console.log('create_host: host=' + JSON.stringify(host));

        /*
        let host = {};
        host.name = '爽揪2';
        host.userid = 'Uxxxxxxxx1'
        host.gender = '女';
        host.clothes = '洋裝';
        host.hat = '草帽';
        host.location = 'Bxxxxxxxx1';
        host.shuangjiouid = 'Idxxxx1';
        */

        this.Host.findOneAndUpdate({ 'shuangjiouid': host.shuangjiouid }, host, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Host saved successfully');
                callback(null);
            }
        });

        /*
        let addHost = new this.Host(host);
        addHost.save(function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Host saved successfully');
                callback(null);
            }
        });
        */
    }

    //根據UserId取得爽主資訊
    this.get_hostbyuserid = function (userid, callback) {
        console.log('get_hostbyuserid: userid=' + userid);

        this.Host.find({ 'userid': userid }, function (err, hosts) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Host get successfully');
                if (hosts)
                    callback(null, hosts);
                else
                    callback(null, null);
            }
        });
    }

    //根據shuangjiouid取得爽主資訊
    this.get_hostbyshuangjiouid = function (shuangjiouid, callback) {
        console.log('get_hostbyshuangjiouid: shuangjiouid=' + shuangjiouid);

        this.Host.find({ 'shuangjiouid': shuangjiouid }, function (err, hosts) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Host get successfully');
                if (hosts)
                    callback(null, hosts);
                else
                    callback(null, null);
            }
        });
    }

    //根據揪團名稱取得爽主資訊
    /*
    this.get_hostbyshuangjiouname = function (shuangjiouname, callback) {
        console.log('get_hostbyshuangjiouname: shuangjiouname=' + shuangjiouname);

        this.Host.findOne({ 'shuangjiouname': shuangjiouname }, function (err, hosts) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Host get successfully');
                if (hosts)
                    callback(null, hosts);
                else
                    callback(null, null);
            }
        });
    }
    */

    //根據BeaconId取得爽主資訊
    this.get_hostbylocation = function (location, callback) {
        console.log('get_hostbylocation: location=' + location);

        this.Host.find({ 'location': location }, function (err, hosts) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Host get successfully');
                if (hosts)
                    callback(null, hosts);
                else
                    callback(null, null);
            }
        });
    }

    //根據爽主名稱更新爽主資訊
    this.set_hostbyname = function (name, host, callback) {
        console.log('set_hostbyname: name=' + name + ' host=' + JSON.stringify(host));

        this.Host.updateOne({ 'name': name }, host, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Host update successfully');
                callback(null);
            }
        });
    }

    //根據爽主UserId更新爽主資訊
    this.set_hostbyuserid = function (userid, host, callback) {
        console.log('set_hostbyuserid: userid=' + userid + ' host=' + JSON.stringify(host));

        this.Host.updateOne({ 'userid': userid }, host, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Host update successfully');
                callback(null);
            }
        });
    }

    //根據爽主名稱刪除爽主資訊
    this.delete_hostbyname = function (name, callback) {
        console.log('delete_hostbyname: name=' + name);

        this.Host.deleteOne({ 'name': name }, host, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Host delete successfully');
                callback(null);
            }
        });
    }
    

    //根據爽主UserId刪除爽主資訊
    this.delete_hostbyuserid = function (userid, callback) {
        console.log('delete_hostbyuserid: userid=' + userid);

        this.Host.deleteOne({ 'userid': userid }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Host delete successfully');
                callback(null);
            }
        });
    }


    //User
    //建立使用者
    this.create_user = function (user, callback) {
        console.log('create_user: user=' + JSON.stringify(user));

        /*
        let user = {};
        user.name = '加一';
        user.userid = 'Uxxxxxxxx2';
        user.image = 'http:xxxxx.xxx.xx';
        user.location = '[Bxxxxxxxx1]';
        user.pushenable = true;        
        */

        this.User.findOneAndUpdate({ 'userid': user.userid }, user, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('User saved successfully');
                callback(null);
            }
        });

        /*
         let addUser = new this.User(user);
         addUser.save(function (err) {
             if (err) {
                 callback(err);
             }
             else {
                 console.log('User saved successfully');
                 callback(null);
             }
         });
         */
    }

    //根據UserId取得使用者資訊
    this.get_userbyuserid = function (userid, callback) {
        console.log('get_userbyuserid: userid=' + userid);

        this.User.findOne({ 'userid': userid }, function (err, user) {
            if (err) {
                callback(err);
            }
            else {
                console.log('User get successfully');
                if (user)
                    callback(null, user);
                else
                    callback(null, null);
            }
        });
    }

    //根據UserIds取得使用者資訊
    this.get_usersbyuserids = function (userids, callback) {
        console.log('get_usersbyuserids: userids=' + userids);

        this.User.find({ 'userid': { $in: userids }}, function (err, users) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Users get successfully');
                if (users)
                    callback(null, users);
                else
                    callback(null, null);
            }
        });
    }

    //根據關注的BeaconId取得使用者資訊
    this.get_userbylocationid = function (locationid, callback) {
        console.log('get_userbylocation: locationid=' + locationid);

        this.User.find({ 'location': { "$in": locationid } }, function (err, users) {
            if (err) {
                callback(err);
            }
            else {
                console.log('User get successfully');
                if (users)
                    callback(null, users);
                else
                    callback(null, null);
            }
        });
    }

    /*
    this.delete_userbyuserid = function (userid, callback) {
        console.log('get_userbyuserid: userid=' + userid);

        this.User.deleteOne({ 'userid': userid }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('User delete successfully');
                callback(null);
            }
        });
    }
    */

    //使用者加入關注的BeaconId
    this.add_watchlocationbyuserid = function (userid, locationid, callback) {
        console.log('add_watchlocationbyuserid: userid=' + userid + ' locationid=' + locationid);

        this.User.updateOne({ 'userid': userid }, { $addToSet: { 'location': locationid } }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('User addwatchlocation successfully');
                callback(null);
            }
        });
    }

    //使用者移除關注的BeaconId
    this.remove_watchlocationbyuserid = function (userid, locationid, callback) {
        console.log('remove_watchlocationbyuserid: userid=' + userid + ' locationid=' + locationid);

        this.User.updateOne({ 'userid': userid }, { $pull: { 'location': locationid } }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('User removewatchlocation successfully');
                callback(null);
            }
        });
    }

    /*
    this.delete_userbylocation = function (location, callback) {
        console.log('delete_userbylocation: location=' + location);

        this.User.deleteOne({ 'location': location }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('User delete successfully');
                callback(null);
            }
        });
    }
    */

    //根據名稱更新使用者資訊
    this.set_userbyname = function (name, user, callback) {
        console.log('set_userbyname: name=' + name + ' user=' + JSON.stringify(user));

        this.User.updateOne({ 'name': name }, user, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('User update successfully');
                callback(null);
            }
        });
    }

    //根據UserId更新使用者資訊
    this.set_userbyuserid = function (userid, user, callback) {
        console.log('set_userbyuserid: userid=' + userid + ' user=' + JSON.stringify(user));

        this.User.updateOne({ 'userid': userid }, user, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('User update successfully');
                callback(null);
            }
        });
    }

    //根據UserId更新使用者pushenable
    this.set_pushenablebyuserid = function (userid, pushenable, callback) {
        console.log('set_pushenablebyuserid: userid=' + userid + ' pushenable=' + JSON.stringify(pushenable));

        this.User.updateOne({ 'userid': userid }, {$set: { "pushenable" : pushenable }}, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('User update successfully');
                callback(null);
            }
        });
    }
    

    //Location
    //建立Beacon資訊
    this.create_location = function (location, callback) {
        console.log('create_location: user=' + JSON.stringify(location));

        /*
        let location = {};
        location.name = '7-11';
        location.locationid = 'Bxxxxxxxxx1';
        location.latitude = '25.0805773';
        location.longitude = '121.565819';
        location.user = [];
        */


        this.Location.findOneAndUpdate({ 'locationid': location.locationid }, location, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Location saved successfully');
                callback(null);
            }
        });

        /*
        let addLocation = new this.Location(location);
        addLocation.save(function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Location saved successfully');
                callback(null);
            }
        });
        */
    }

    //加入進入Beacon的使用者UserId
    this.enter_usertolocation = function (userid, locationid, callback) {
        console.log('enter_usertolocation: userid=' + userid + ' locationid=' + locationid);

        this.Location.updateOne({ 'locationid': locationid }, { $addToSet: { 'user': userid } }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Location adduser successfully');
                callback(null);
            }
        });
    }

    //移除離開Beacon的使用者UserId
    this.leave_userfromlocation = function (userid, locationid, callback) {
        console.log('leave_userfromlocation: userid=' + userid + ' locationid=' + locationid);

        this.Location.updateOne({ 'locationid': locationid }, { $pull: { 'user': userid } }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Location removeuser successfully');
                callback(null);
            }
        });
    }

    //取得進入此BeaconId的使用者UserId
    this.get_locationuser = function (locationid, callback) {
        console.log('get_locationuser: locationid=' + locationid);

        this.Location.findOne({ 'locationid': locationid }, function (err, location) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Location getuser successfully');
                if (location && location.user)
                    callback(null, location.user);
                else
                    callback(null, null);
            }
        });
    }

    this.get_locationidbyuser = function (userid, callback) {
        console.log('get_locationidbyuser: userid=' + userid);

        this.Location.findOne({ 'user': userid }, function (err, location) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Location getlocation successfully');
                if (location && location.locationid)
                    callback(null, location.locationid);
                else
                    callback(null, null);
            }
        });
    }

    //根據BeaconId取得location訊息
    this.get_locationbyid = function (locationid, callback) {
        console.log('get_locationbyid: locationid=' + locationid);

        this.Location.findOne({ 'locationid': locationid }, function (err, location) {
            if (err) {
                callback(err);
            }
            else {
                console.log('Location getlocation successfully');
                if (location)
                    callback(null, location);
                else
                    callback(null, null);
            }
        });
    }

    //計算距離(公尺)
    this.getdistance = function (lat1, lng1, lat2, lng2) {
        var radLat1 = lat1 * Math.PI / 180.0;
        var radLat2 = lat2 * Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        return s * 1000;
    }
}

exports.linemongodb = linemongodb;