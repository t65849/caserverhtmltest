var linemongodb = require('./linemongodb');
var linedb = new linemongodb.linemongodb();

/*
let user = {};
user.name = '加一'; //使用者名稱
user.userid = 'Uxxxxxxxx1'; //使用者Id
user.image = 'http:xxxxx.xxx.xx1'; //使用者頭像
user.location = '[Bxxxxxxxx1]'; //關注的BeaconId
//建立使用者
linedb.create_user(user, function (err) {
    if (err)
        console.log('fail: ' + err);
    else
        console.log('success');
});


let host = {};
host.name = '加一'; //爽主姓名
host.userid = 'Uxxxxxxxx1'; //爽主Id
host.gender = '男'; //爽主性別
host.clothes = '無'; //爽主衣服
host.hat = '無'; //爽主帽子
host.shuangjiouname = '爽揪'; //揪團名稱
host.location = 'Bxxxxxxxx1'; //爽主揪團位置的BeaconId
//建立爽主資訊
linedb.create_host(host, function (err) {
    if (err)
        console.log('fail: ' + err);
    else
        console.log('success');
});

let shuangjiou = {};
shuangjiou.name = '爽揪'; //揪團名稱
shuangjiou.description = '爽揪'; //揪團描述
shuangjiou.time = Date.now(); //揪團時間
shuangjiou.type = '吃'; //揪團類型
shuangjiou.host = 'Uxxxxxxxx1'; //爽主Id
shuangjiou.location = 'Bxxxxxxxx1'; //揪團BeaconId
shuangjiou.number = '99'; //所需人數
shuangjiou.participant = []; //參加者的UserId
//建立揪團資訊
linedb.create_shuangjiou(shuangjiou, function (err) {
    if (err)
        console.log('fail: ' + err);
    else
        console.log('success');
});
*/


/*
//取得此BeaconId的揪團資訊
linedb.get_shuangjioubylocation('Bxxxxxxxx1', function (err, shuangjious) {
    if (err) {
        console.log(err); return;
    }
    console.log('get_shuangjioubylocation = ' + shuangjious);
});

//取得此Beacon發起的爽主資訊
linedb.get_hostbylocation('Bxxxxxxxx1', function (err, hosts) {
    if (err) {
        console.log(err); return;
    }
    console.log('get_hostbylocation = ' + hosts);
});
*/

/*
let location = {};
location.name = '7-11'; //Beacon名稱
location.locationid = 'Bxxxxxxxx1'; //BeaconId
location.user = []; //進入Beacon附近的UserId
//建立Beacon資訊
linedb.create_location(location, function (err, hosts) {
    if (err) {
        console.log(err); return;
    }
    console.log('create_location = ' + hosts);
});

//進入Beacon附近將UserId加入
linedb.enter_usertolocation('Uxxxxxxxx1', location.locationid,function(err){

});
linedb.enter_usertolocation('Uxxxxxxxx2', location.locationid,function(err){
        
});

//取得Beacon附近的UserId
linedb.get_locationuser('Bxxxxxxxx1', function(err, users){
    if (err) {
        console.log(err); return;
    }
    console.log(JSON.stringify(users));
})

//離開Beacon附近將UserId移除
linedb.leave_userfromlocation('Uxxxxxxxx2', 'Bxxxxxxxx1', function(err){

})
*/

/*
//取得關注此BeaconId的使用者
linedb.get_userbylocationid('Bxxxxxxxx1', function(err, users){
    if (err) {
        console.log(err); return;
    }
    console.log(JSON.stringify(users));
})

//使用者加入關注地點的BeaconId
linedb.add_watchlocationbyuserid('Uxxxxxxxx1', 'Bxxxxxxxx2', function(err){

})

//使用者移除關注地點的BeaconId
linedb.remove_watchlocationbyuserid('Uxxxxxxxx2', 'Bxxxxxxxx3', function(err){

})

*/

linedb.get_hostbyshuangjiouname('爽揪', function (err, host) {
    console.log(JSON.stringify(host));
})