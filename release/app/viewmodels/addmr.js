define(['plugins/dialog','durandal/app','knockout','plugins/router'], function (dialog,app,ko,router) {
    return {
        activate:function(){},
        attached:function(){
            var baseUrl=appConfig.app.baseUrl;
            var ucode = appConfig.app.ucode;
            var user  = appConfig.app.user;
            var dbs=new dbHelper(baseUrl,user,ucode);
            var resid=appConfig.meetingroom.resid;
            mini.parse();  
            var fileupload = mini.get("fileupload1");//上传图片
            fileupload.setUploadUrl(appConfig.app.uploadFileUrl+appConfig.app.uppath+appConfig.app.httppath);
            var imgfield=mini.get('imgurl');
            var imgurl= imgfield.getValue();
            if (imgurl)
            {
                var img=$("#imgUploaded");//显示图片
                img[0].src=imgurl;
            };
            saveClick=function(){//保存按钮
                mini.parse();
                var form = new mini.Form("form");
                var o =  new mini.Form("form").getData();
                form.validate(); 
                if (form.isValid() == false) return;
                o._id=1;
                o._state="added";
                var json = mini.encode([o]);
                dbs.dbSavedata(resid,0,json,dataSaved,fnerror,fnhttperror);
                function empty(){//清空相应内容
                    $('input[name="tel"]').val("");
                    $('input[name="mname"]').val("");
                    $('input[name="mrimage"]').val("");
                    $('#imgUploaded').attr("src","");
                }
                function dataSaved(text){
                    dialog.showMessage('<h1>添加成功</h1>','会议室新增',['返回'],true);
                    empty();
                };
                function fnerror(text){
                    dialog.showMessage(text.message,'添加失败',['返回'],true);
                    empty();
                };
                function fnhttperror(jqXHR, textStatus, errorThrown){
                    dialog.showMessage('error','会议室新增',['返回'],true);
                    empty();
                }
            }  
        }
    }
})