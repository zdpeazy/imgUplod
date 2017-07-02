var mysql      = require('mysql');
var moment = require('moment');

var connectMysql = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '123456',
  database : 'eazdp'
});

var resInfo = {'code': '0001', 'msg': 'error'};
var imgInfoList;

module.exports = {
    selectImgTable: function(req, res){
        var selectSQL = 'SELECT * FROM eazdp.img_table';

        connectMysql.query(selectSQL, function (error, results, fields) {
          if (error) throw error;
          imgInfoList = results;
          resInfo = {'code': '0002', 'msg': '查询成功', 'data': imgInfoList};
          res.send(resInfo);

        });

    },
    insertImgTable: function(req, res){
        var dateTime =  getTime(req)*1000;
        var insertSQL = 'insert into eazdp.img_table values("id", "imgId", "date", "url", "name"),("1", "'+ req.body.id +'", "'+ dateTime +'", "'+ req.body.url +'", "'+ req.body.name +'")';
        connectMysql.query(insertSQL, function (error, results, fields) {
          if (error) throw error;
          var resInfo = {'code': '0002', 'msg': '入库成功'};
          res.send(resInfo);
        });

    }
};

function getTime(req){
    return moment().format('X');
} 



