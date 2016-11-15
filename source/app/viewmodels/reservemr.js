define(['durandal/app','knockout','plugins/router','plugins/dialog','calendar/fullcalendar'], function (app,ko,router,dialog,fullcalendar) {
    var baseUrl=appConfig.app.baseUrl;
    var ucode = appConfig.app.ucode;
    var user  = appConfig.app.user;
    var getMethod = appConfig.app.getMethod
    var dbs=new dbHelper(baseUrl,user,ucode);
    var subresid=appConfig.meetingroom.subresid;
    var poresid=appConfig.meetingroom.poresid;
    var mid;
    var y,m,d;
    var reservemr = function(){//异步请求:捕获搜索框中字符串,并获取后台数据动态更新表格,
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
                return self.keyTextValue();
            }
        });
    };
    reservemr.prototype.compositionComplete=function (view){
            mini.parse();
    }
    function closeMinipopup(){//将参会人员未从DOM中移除的div
         $(".mini-shadow").remove();
         $(".mini-popup").remove();
    }
    reservemr.prototype.attached=function(){
        mini.parse();
        var urllist=baseUrl + "&method=" + getMethod + "&user=" + user + "&ucode=" + ucode + "&subresid=0&resid=" + poresid + "&cmswhere=";
        var grid = mini.get("datagrid1");
        grid.set({url:urllist, ajaxOptions:{dataType:"jsonp",jsonp:"jsoncallback"}});//跨域请求
        function loadSuccess(e){
            //console.log(e);
        }
        var start='<input name="start" format="yyyy-MM-dd H:mm" value="'+y+'-'+m+'-'+d+' 9:00" style="width:250px" class="mini-datepicker" showOkButton="true" showTime="true" required="true"/>'
        $('#start').append(start);//动态设置开始时间
        var endtime='<input name="endtime" format="yyyy-MM-dd H:mm" value="'+y+'-'+m+'-'+d+' 10:00" style="width:250px" class="mini-datepicker" showOkButton="true" showTime="true" required="true"/>'
        $('#endtime').append(endtime);//动态设置结束时间
    };
    reservemr.prototype.ok = function() {//保存按钮
        var that=this;
        mini.parse();
        var form = new mini.Form("form");
        var o =  new mini.Form("form").getData();
        form.validate(); 
        if (form.isValid() == false) return;
        o._id=1;
        o._state="added";
        o.mid=mid;
        var json = mini.encode([o]);
        dbs.dbSavedata(subresid,0,json,dataSaved,fnerror,fnhttperror);
        function dataSaved(text){
            dialog.showMessage('<h1>申请成功</h1>','会议室申请',['返回'],true);
            closeMinipopup();
            dialog.close(that);
        }
        function fnerror(text){
            dialog.showMessage(text.message,'会议室申请失败',['返回'],true);
        }
        function fnhttperror(jqXHR, textStatus, errorThrown){
            dialog.showMessage('error','会议室申请',['返回'],true);
        }
    };
    reservemr.prototype.cancel = function() {
        mini.parse()
        closeMinipopup();
        dialog.close(this);
    };
    reservemr.show = function(mdata,yyyy,mm,dd){
        if(yyyy==undefined){
            var date = new Date();
            yyyy = date.getFullYear();//获取当前系统时间：年、月、日，并通过月份判断，上一个月&年，下一个月&年
		    mm = date.getMonth();
		    dd = date.getDate();
        }
        mid=mdata;
        y=yyyy;
        m=mm+1;
        d=dd;
        return dialog.show(new reservemr() );
    };
    return reservemr;
})