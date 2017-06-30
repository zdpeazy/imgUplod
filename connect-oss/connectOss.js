var co = require('co');
var OSS = require('ali-oss');
var fs = require('fs');

var client = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAIUXtM8m4BcELr',
  accessKeySecret: 'Me0PFWDeMt1UBxfEecrHHGw0Cny5dZ'
});

var resInfo = {'code': '0001', 'msg': 'error'};
var pathBox = 'ImgResource/design/';

module.exports = {
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


