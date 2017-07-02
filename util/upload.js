var apiUrl = 'http://localhost:3000/';
var REQ_CODE = 0002;
$(function(){

    $.ajax({
        type: "post",
        method: "POST",
        data: {hs_type:"3"},
        dataType: "json",
        url: apiUrl + "api/configInfo",
        beforeSend: function(XMLHttpRequest){

        },
        success: function(data, textStatus){
            if(REQ_CODE == data.code*1){
                //var configList = JSON.parse(data.data);
                var configList = data.data;
                registerConfig(configList);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
            //console.log(XMLHttpRequest);
        },
        error: function(err){
            console.log(err);
            //请求出错处理
        }
    });
    $.ajax({
        type: "post",
        method: "POST",
        data: {hs_type:"3"},
        dataType: "json",
        url: apiUrl + "api/selectImgInfo",
        beforeSend: function(XMLHttpRequest){

        },
        success: function(data, textStatus){
            if(REQ_CODE == data.code*1){
                console.log(data.data);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
            //console.log(XMLHttpRequest);
        },
        error: function(err){
            console.log(err);
            //请求出错处理
        }
    });
})

function insertSQL(id, url, name){
    $.ajax({
        type: "post",
        method: "POST",
        data: {id: id, url: url, name: name,},
        dataType: "json",
        url: apiUrl + "api/insertImgInfo",
        beforeSend: function(XMLHttpRequest){

        },
        success: function(data, textStatus){
            if(REQ_CODE == data.code*1){
                console.log(data);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
            //console.log(XMLHttpRequest);
        },
        error: function(err){
            console.log(err);
            //请求出错处理
        }
    });
}

//注册配置信息
function registerConfig(conIn){
    var policyText = {
      "expiration": conIn.expiration, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
      "conditions": [
        ["content-length-range", 0, conIn.maxsize] // 设置上传文件的大小限制
      ]
    };

    accessid = conIn.accessid;
    accesskey = conIn.accesskey;
    host = conIn.host;
    
    var policyBase64 = Base64.encode(JSON.stringify(policyText));
    var message = policyBase64;
    var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true }) ;
    var signature = Crypto.util.bytesToBase64(bytes);

    uploaderConponent(accessid, accessid, host, signature, policyBase64, conIn.path)
}

// plupload组件   http://www.phpin.net/tools/plupload/ 
function uploaderConponent(accessid, accessid, host, signature, policyBase64, path){
    var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : 'selectfiles', 
        container: document.getElementById('container'),
        flash_swf_url : './lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url : './lib/plupload-2.1.2/js/Moxie.xap',

        url : host,

        multipart_params: {
            'Filename': '${filename}', 
            'key': path + '${filename}',
            'policy': policyBase64,
            'OSSAccessKeyId': accessid, 
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'signature': signature,
        },

        init: {
            PostInit: function(up, files) {
                document.getElementById('ossfile').innerHTML = '';
                document.getElementById('postfiles').onclick = function() {
                    console.log(files);
                    uploader.start();
                    return false;
                };
            },

            FilesAdded: function(up, files) {
                plupload.each(files, function(file) {
                    document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
                    +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                    +'</div>';
                });
                insertSQL(files[0].id, host + '/' + files[0].name, files[0].name)
            },

            UploadProgress: function(up, file) {
                var d = document.getElementById(file.id);
                d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                var prog = d.getElementsByTagName('div')[0];
                var progBar = prog.getElementsByTagName('div')[0]
                progBar.style.width= 2*file.percent+'px';
                progBar.setAttribute('aria-valuenow', file.percent);
            },

            FileUploaded: function(up, file, info) {
                if (info.status >= 200 || info.status < 200)
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'success';
                }
                else
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                } 
            },

            Error: function(up, err) {
              document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
            }
        }
    });

    uploader.init();
}



