define(['durandal/app','knockout','plugins/router','plugins/dialog'], function (app,ko,router,dialog) {
    var baseUrl=appConfig.app.baseUrl;
    var ucode = appConfig.app.ucode;
    var user  = appConfig.app.user;
    var dbs=new dbHelper(baseUrl,user,ucode);
    var subresid=appConfig.meetingroom.subresid;
    var poresid=appConfig.meetingroom.poresid;
    var mid,id;
    var editreserve = function(buttonEnable) {
        this.className="";
        this.buttonEnable=buttonEnable;
        this.keyTextValue=ko.observable("");
        var self=this;
        this.filtertext=ko.computed(function () {//异步请求:捕获搜索框中字符串,并获取后台数据动态更新表格,
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
    editreserve.prototype.compositionComplete=function (view){
            mini.parse();
    }
    function closeMinipopup(){//将参会人员未关闭的div从DOM树中移除
         $(".mini-shadow").remove();
         $(".mini-popup").remove();
    }
    editreserve.prototype.attached=function(){
        var me=this;
        mini.parse();
        cmswhere="rec_id="+id;
        dbs.dbGetdata(subresid,0,cmswhere,fnSuccess,null,null);//获取并设置页面数据
        function fnSuccess(data){
            var form = new mini.Form("editform");
            form.setData(data[0]);
            var poupList = '<input id="lookup" text="'+data[0].C3_531241226642+'" name="C3_531241226642" class="mini-lookup" style="width:450px" popup="#gridPanel" grid="#datagrid1" multiSelect="true" textField="C3_384367557332" valueField="C3_384367557332"/>'
            $('#poup').append(poupList);//动态添加参会人员列表
            mini.parse();
        }
        var urllist=baseUrl + "&method=" + appConfig.app.getMethod + "&user=" + user + "&ucode=" + ucode + "&subresid=0&resid=" + poresid + "&cmswhere=";
        var grid = mini.get("datagrid1");
        grid.set({url:urllist, ajaxOptions:{dataType:"jsonp",jsonp:"jsoncallback"}});//跨域请求
        function loadSuccess(e){
            //console.log(e);
        }
    };
    editreserve.prototype.ok = function() {//修改按钮
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
                dialog.showMessage(text.message,'修改失败',['返回'],true);
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
    editreserve.prototype.del = function() {//删除按钮
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
                closeMinipopup();
                dialog.close(that);
            }
            function fnerror(text){
                dialog.showMessage(text.message,'删除失败',['返回'],true);
                closeMinipopup();
            }
            function fnhttperror(jqXHR, textStatus, errorThrown){
                dialog.showMessage('error','错误',['返回'],true);
                closeMinipopup();
            }
        }else{
            return;
        }
        dialog.close(this);
    };
    editreserve.show = function(event){
        id=event.id;
        return dialog.show(new editreserve(event.className[0]=='classofme') );
    };
    return editreserve;
})