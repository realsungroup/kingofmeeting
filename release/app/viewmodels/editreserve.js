define(['durandal/app','knockout','plugins/router','plugins/dialog','calendar/fullcalendar'], function (app,ko,router,dialog,fullcalendar) {
    var baseUrl=appConfig.app.baseUrl;
    var ucode = appConfig.app.ucode;
    var user  = appConfig.app.user;
    var dbs=new dbHelper(baseUrl,user,ucode);
    var subresid=appConfig.meetingroom.subresid;
    var poresid=appConfig.meetingroom.poresid;
    var mid,id;
    //var sy,sM,sd,sh,sm,ey,eM,ed,eh,em,title;
    
    var editreserve = function() {
    this.keyTextValue=ko.observable("");
    var self=this;
    this.filtertext=ko.computed(function () { 
         if (self.keyTextValue()!=="" && self.keyTextValue()!==undefined){   
               
                var grid = mini.get("datagrid1");
                setTimeout(function() {
                     grid.load({
                     key: self.keyTextValue()
                });
                }, 500);
               
                //  console.log('keyTextValue');
                 return self.keyTextValue();
           }
         });
   
    };
    editreserve.prototype.compositionComplete=function (view)
    {
            mini.parse();
          
    }
    
    function closeMinipopup()
    {
         $(".mini-shadow").remove();
         $(".mini-popup").remove();
    }
    editreserve.prototype.attached=function(){
        mini.parse();
        cmswhere="rec_id="+id;
        dbs.dbGetdata(subresid,0,cmswhere,fnSuccess,null,null);
        function fnSuccess(data){
            var form = new mini.Form("editform");
            form.setData(data[0]);
            var poupText = '<input id="lookup" text="'+data[0].C3_531241226642+'" name="C3_531241226642" class="mini-lookup" style="width:450px" popup="#gridPanel" grid="#datagrid1" multiSelect="true" textField="C3_384367557332" valueField="C3_384367557332"/>'
            $('#poup').append(poupText);
            //$('#lookup').removeAttr('readonly');
            mini.parse();
        }

        var urllist=appConfig.app.baseUrl + "&method=" + appConfig.app.getMethod + "&user=" + appConfig.app.user + "&ucode=" + appConfig.app.ucode + "&subresid=0&resid=" + poresid + "&cmswhere=";
        
        var grid = mini.get("datagrid1");
       
        grid.set({url:urllist, ajaxOptions:{dataType:"jsonp",jsonp:"jsoncallback"}});
       // grid.load({key:""},loadSuccess,null);
        function loadSuccess(e)
        {
            //console.log(e);
        }
        // var titleText = '<input class="mini-textbox" name="title" value="'+title+'" required="true"/>'
        // $('#title').append(titleText);
        // var start = '<input name="start" format="yyyy-MM-dd H:mm" value="'+sy+'-'+sM+'-'+sd+' '+sh+':'+sm+'" style="width:250px" class="mini-datepicker" showOkButton="true" showTime="true" required="true"/>'
        // $('#start').append(start);
        // var endtime = '<input name="endtime" format="yyyy-MM-dd H:mm" value="'+ey+'-'+eM+'-'+ed+' '+eh+':'+em+'" style="width:250px" class="mini-datepicker" showOkButton="true" showTime="true" required="true"/>'
        // $('#endtime').append(endtime);
        
    };
    editreserve.prototype.ok = function() {
       
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
            dbs.dbSavedata(subresid,0,json,dataSaved,fnerror,fnhttperror);
            function dataSaved(text){
                dialog.showMessage('<h1>修改成功</h1>','会议预定编辑',['返回'],true);
                dialog.close(that);
                closeMinipopup();
            }
            function fnerror(text){
                dialog.showMessage(text,'修改失败',['返回'],true);
            }
            function fnhttperror(jqXHR, textStatus, errorThrown){
                dialog.showMessage('error','错误',['返回'],true);
            }
        }else{
            return;
        }
        
    };
    editreserve.prototype.cancel = function() {
        mini.parse()
        closeMinipopup();
        dialog.close(this);
    };
    editreserve.prototype.del = function() {
        mini.parse()
        var that=this;
        if(confirm('您确定要删除么？')){
            var form = new mini.Form("editform");
            var o =  new mini.Form("editform").getData();
            form.validate(); 
            if (form.isValid() == false) return;
            o._id=1;
            o._state="modified";
            o.remove="Y";
            var json = mini.encode([o]);
            dbs.dbSavedata(subresid,0,json,dataSaved,fnerror,fnhttperror);
            function dataSaved(text){
                dialog.showMessage('<h1>删除成功</h1>','会议预定编辑',['返回'],true);
                dialog.close(that);
            }
            function fnerror(text){
                dialog.showMessage(text,'删除失败',['返回'],true);
            }
            function fnhttperror(jqXHR, textStatus, errorThrown){
                dialog.showMessage('error','错误',['返回'],true);
            }
        }else{
            return;
        }
        closeMinipopup();
        dialog.close(this);
    };
    editreserve.show = function(event){
        // console.log(event);
		// sy = event.start.getFullYear();
		// sM = event.start.getMonth()+1;
        // sd = event.start.getDate();
        // sh = event.start.getHours();
        // sm = event.start.getMinutes();
        // ey = event.end.getFullYear();
		// eM = event.end.getMonth()+1;
        // ed = event.end.getDate();
        // eh = event.end.getHours();
        // em = event.end.getMinutes();
        // title = event.title;
        id=event.id;
        return dialog.show(new editreserve() );
        
    };
    return editreserve;
})