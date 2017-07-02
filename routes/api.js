var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ossApi = require('../connect-oss/connectOss');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = module.exports = express();

router.post('/configInfo', urlencodedParser, function(req, res){
  ossApi.configInfo(req, res);
});

router.post('/selectImgInfo', urlencodedParser, function(req, res){
  ossApi.selectImgInfo(req, res);
});

router.post('/insertImgInfo', urlencodedParser, function(req, res){
  ossApi.insertImgInfo(req, res);
});

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

