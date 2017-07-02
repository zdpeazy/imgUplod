var co = require('co');
var OSS = require('ali-oss');
var fs = require('fs');
var sqlMoudle = require('../connect-mysql/connectMysql');

var client = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAIUXtM8m4BcELr',
  accessKeySecret: 'Me0PFWDeMt1UBxfEecrHHGw0Cny5dZ'
});

var configList = {
  accessid: 'LTAIUXtM8m4BcELr',
  accesskey: 'Me0PFWDeMt1UBxfEecrHHGw0Cny5dZ',
  host: 'http://imgarehouse.oss-cn-shanghai.aliyuncs.com',
  expiration: '2020-01-01T12:00:00.000Z',
  path: 'ImgResource/design/',
  maxsize: 1048576000
} 

var resInfo = {'code': '0001', 'msg': 'error'};
var pathBox = 'ImgResource/design/';

module.exports = {
  //配置信息接口
  configInfo: function(req, res){
    if(configList){
      resInfo = {'code': '0002', 'msg': '配置信息列表', 'data': configList};
    }
    resEnd(resInfo, res);
  },

  // 查询数据库
  selectImgInfo: function(req, res){
    sqlMoudle.selectImgTable(req, res);
  },

  // 图片信息入数据库
  insertImgInfo: function(req, res){
    sqlMoudle.insertImgTable(req, res);
  },

  // 查看Bucket列表
  returnBuckets: function(req, res){
    co(function* () {
      var result = yield client.listBuckets();
      result = JSON.stringify(result);
      if(result){
        resInfo = {'code': '0002', 'msg': 'Buckets列表', 'data': result};
      }
      resEnd(resInfo, res);
    }).catch(function (err) {
      console.log(err);
    });
  },

  //查看文件列表
  selectFileList: function () {
    co(function* () {
      client.useBucket('imgarehouse');
      var result = yield client.list({
        'max-keys': 5
      });
      result = JSON.stringify(result);
      if(result){
        resInfo = {'code': '0002', 'msg': '文件列表', 'data': result};
      }
      resEnd(resInfo, res);
    }).catch(function (err) {
      console.log(err);
    });
  },

  //文件分片上传（断点上传）
  uploadImg: function (req, res) {
    var objectKey = req.body.objectKey;
    var Imgpath = req.body.Imgpath;
    co(function* () {
      client.useBucket('imgarehouse');
      var result = yield client.multipartUpload(pathBox + objectKey, Imgpath, {
        progress: function* (p) {
          console.log('Progress: ' + p);
        }
      });
      result = JSON.stringify(result);
      if(result){
        resInfo = {'code': '0002', 'msg': '上传文件成功', 'data': result};
      }
      resEnd(resInfo, res);
    }).catch(function (err) {
      console.log(err);
    });
  },

  // 删除文件
  deleteImg: function(req, res){
    co(function* () {
      client.useBucket('imgarehouse');
      var result = yield client.delete('ImgResource/design/aaa.jpg');
      result = JSON.stringify(result);
      if(result){
        resInfo = {'code': '0002', 'msg': '删除文件成功', 'data': result};
      }
      resEnd(resInfo, res);
    }).catch(function (err) {
      console.log(err);
    });
  }

};

function resEnd(json, res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8','Connection':'Keep-alive','Keep-Alive':'timeout=60'});
    res.send(json);
};


