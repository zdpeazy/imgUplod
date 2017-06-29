var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = module.exports = express();

router.post('/saveImg', urlencodedParser, function(req, res){
    var result={'code':'0001','msg':'error'};
    console.log(req.body);
    resEnd(result, res);
});

function resEnd(json, res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8','Connection':'Keep-alive','Keep-Alive':'timeout=60'});
    res.send(json);
};

module.exports = router;

