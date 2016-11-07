define(['durandal/app','knockout','plugins/router','plugins/dialog','calendar/fullcalendar'], function (app,ko,router,dialog,fullcalendar) {
    var baseUrl=appConfig.app.baseUrl;
    var ucode = appConfig.app.ucode;
    var user  = appConfig.app.user;
    var dbs=new dbHelper(baseUrl,user,ucode);
    var subresid=appConfig.meetingroom.subresid;
    var poresid=appConfig.meetingroom.poresid;
    var mid;
    var y,m,d;
    
    var reservemr = function() {
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
    reservemr.prototype.compositionComplete=function (view)
    {
            mini.parse();
          
    }
    
    function closeMinipopup()
    {
         $(".mini-shadow").remove();
         $(".mini-popup").remove();
    }
    reservemr.prototype.attached=function(){
        mini.parse();

        var urllist=appConfig.app.baseUrl + "&method=" + appConfig.app.getMethod + "&user=" + appConfig.app.user + "&ucode=" + appConfig.app.ucode + "&subresid=0&resid=" + poresid + "&cmswhere=";
        
        var grid = mini.get("datagrid1");
       
        grid.set({url:urllist, ajaxOptions:{dataType:"jsonp",jsonp:"jsoncallback"}});
       // grid.load({key:""},loadSuccess,null);
        function loadSuccess(e)
        {
            //console.log(e);
        }
        var start='<input name="start" format="yyyy-MM-dd H:mm" value="'+y+'-'+m+'-'+d+' 9:00" style="width:250px" class="mini-datepicker" showOkButton="true" showTime="true" required="true"/>'
        $('#start').append(start);
        var endtime='<input name="endtime" format="yyyy-MM-dd H:mm" value="'+y+'-'+m+'-'+d+' 10:00" style="width:250px" class="mini-datepicker" showOkButton="true" showTime="true" required="true"/>'
        $('#endtime').append(endtime);
        
    };
    reservemr.prototype.ok = function() {
       
        var that=this;
        mini.parse();
        var form = new mini.Form("form");
        var o =  new mini.Form("form").getData();
        form.validate(); 
        if (form.isValid() == false) return;
         $('#ok').attr({"disabled":"disabled"});
        o._id=1;
        o._state="added";
        o.mid=mid;
        var json = mini.encode([o]);
        dbs.dbSavedata(subresid,0,json,dataSaved,fnerror,fnhttperror);
        function dataSaved(text){
            dialog.showMessage('<h1>申请成功</h1>','会议室申请',['返回'],true);
           // parent.location.reload();
            closeMinipopup();
            dialog.close(that);
           
          
        }
        function fnerror(text){
            dialog.showMessage(text,'会议室申请失败',['返回'],true);
            //alert(text);
        }
        function fnhttperror(jqXHR, textStatus, errorThrown){
            dialog.showMessage('error','会议室申请',['返回'],true);
          
        }
        
    };
    reservemr.prototype.cancel = function() {
        mini.parse()
       // parent.location.reload();
        closeMinipopup();
        dialog.close(this);
    };
    reservemr.show = function(mdata,yyyy,mm,dd){
        mid=mdata;
        y=yyyy;
        m=mm;
        d=dd;
        return dialog.show(new reservemr() );
        
    };
    return reservemr;
})