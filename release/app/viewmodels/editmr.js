define(['durandal/app','knockout','plugins/router','plugins/dialog','calendar/fullcalendar'], function (app,ko,router,dialog,fullcalendar) {
    var mid;
    var baseUrl=appConfig.app.baseUrl;
    var ucode = appConfig.app.ucode;
    var user  = appConfig.app.user;
    var dbs=new dbHelper(baseUrl,user,ucode);
    var resid=appConfig.meetingroom.resid;
    var cmswhere;
    var editmr = function() {
    };
    editmr.prototype.del = function(){//删除按钮
        var that=this;
        if(confirm('您确定要删除么？')){
            mini.parse();
            var form = new mini.Form("editform");
            var o =  new mini.Form("editform").getData();
            form.validate(); 
            if (form.isValid() == false) return;
            o._id=1;
            o._state="modified";
            o.remove="Y";
            o.mname="";
            o.tel="";
            var json = mini.encode([o]);
            dbs.dbSavedata(resid,0,json,dataSaved,fnerror,fnhttperror);
            function dataSaved(text){
                dialog.showMessage('<h1>删除成功</h1>','会议室新增',['返回'],true);
                $('#refreshmr').click()
                dialog.close(that);
            }
            function fnerror(text){
                dialog.showMessage(text.message,'删除失败',['返回'],true);
            }
            function fnhttperror(jqXHR, textStatus, errorThrown){
                dialog.showMessage('error','错误',['返回'],true);
            }
        }else{
            return;
        }
    };
    editmr.prototype.cancel = function() {
        dialog.close(this) 
    };
    editmr.prototype.ok = function() {//修改按钮
        var that=this;
        if(confirm('您确定要修改么？')){
            mini.parse();
            var form = new mini.Form("editform");
            var o =  new mini.Form("editform").getData();
            form.validate(); 
            if (form.isValid() == false) return;
            o._id=1;
            o._state="modified";
            var json = mini.encode([o]);
            dbs.dbSavedata(resid,0,json,dataSaved,fnerror,fnhttperror);
            function dataSaved(text){
                dialog.showMessage('<h1>修改成功</h1>','会议室编辑',['返回'],true);
                dialog.close(that);
            }
            function fnerror(text){
                dialog.showMessage(text.message,'修改失败',['返回'],true);
            }
            function fnhttperror(jqXHR, textStatus, errorThrown){
                dialog.showMessage('error','错误',['返回'],true);
            }
        }else{
            return;
        }
    };
    editmr.prototype.attached=function(){
        mini.parse();
        cmswhere="mid="+mid;
        dbs.dbGetdata(resid,0,cmswhere,fnSuccess,null,null);//获取并设置页面数据
        function fnSuccess(data){
            mini.parse();
            var form = new mini.Form("editform");
            form.setData(data[0]);
            var fileupload=mini.get("fileupload1");
            fileupload.setUploadUrl(appConfig.app.uploadFileUrl+appConfig.app.uppath+appConfig.app.httppath);
            var imgfield=mini.get('imgurl');
            var imgurl=imgfield.getValue();
            if (imgurl)
            { 
                var img=$("#imgUploaded");
                img[0].src=imgurl;
            }   
        }
    };
    editmr.show = function(mdata){
        mid=mdata;
        return dialog.show(new editmr());
    };
    return editmr;
})