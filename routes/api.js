var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ossApi = require('../connect-oss/connectOss');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = module.exports = express();

router.post('/selectBuckets', urlencodedParser, function(req, res){
  ossApi.returnBuckets(req, res);
});

router.post('/selectFileList', urlencodedParser, function(req, res){
  ossApi.selectFileList(req, res);
});

router.post('/uploadImg', urlencodedParser, function(req, res){
  ossApi.uploadImg(req, res);
});

router.post('/deleteImg', urlencodedParser, function(req, res){
  ossApi.deleteImg(req, res);
});

module.exports = router;

