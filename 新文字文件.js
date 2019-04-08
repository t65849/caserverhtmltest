var Jieba = require('node-jieba');
var analyzer = Jieba({
    debug: false
});
analyzer.dict('dict.txt', function (err) { //==
    if (err) console.log(err)
    analyzer.pseg("第一筆資料大同寶寶", {
        mode: Jieba.mode.SEARCH,
        HMM: true
    }, function (err, result) {
        if (err) console.log(err);
        console.log(JSON.stringify(result))
    })
});