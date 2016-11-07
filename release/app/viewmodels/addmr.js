define(['durandal/app','knockout','plugins/router',], function (app,ko,router) {
    return {
        activate:function(){},
        attached:function(){
            baseUrl=appConfig.app.baseUrl;
            var ucode = appConfig.app.ucode;
            var user  = appConfig.app.user;
            var dbs=new dbHelper(baseUrl,user,ucode);
            var resid=appConfig.meetingroom.resid;
            mini.parse();  

            var fileupload = mini.get("fileupload1");
            fileupload.setUploadUrl(appConfig.app.uploadFileUrl+appConfig.app.uppath+appConfig.app.httppath);
            var imgfield=mini.get('imgurl');
            var imgurl= imgfield.getValue();
            if (imgurl)
            {
                var img=$("#imgUploaded");
                img[0].src=imgurl;
            }


            saveClick=function(){
                    mini.parse();
                    var form = new mini.Form("form");
                    var o =  new mini.Form("form").getData();
                    form.validate(); 
                    if (form.isValid() == false) return;
                    o._id=1;
                    o._state="added";
                    var json = mini.encode([o]);
                    dbs.dbSavedata(resid,0,json,dataSaved,fnerror,fnhttperror);
                    
                    function dataSaved(text){
                        dialog.showMessage('<h1>添加成功</h1>','会议室新增',['返回'],true);
                        $('input[name="tel"]').val("");
                        $('input[name="mname"]').val("");
                        $('input[name="mrimage"]').val("");
                        $('#imgUploaded').attr("src","");
                    }
                    function fnerror(text){
                        dialog.showMessage(text,'添加失败',['返回'],true);
                        $('input[name="tel"]').val("");
                        $('input[name="mname"]').val("");
                        $('input[name="mrimage"]').val("");
                        $('#imgUploaded').attr("src","");
                    }
                    function fnhttperror(jqXHR, textStatus, errorThrown){
                        dialog.showMessage('error','会议室新增',['返回'],true);
                        $('input[name="tel"]').val("");
                        $('input[name="mname"]').val("");
                        $('input[name="mrimage"]').val("");
                        $('#imgUploaded').attr("src","");
                        
                    }

            }  
        }
    }
})