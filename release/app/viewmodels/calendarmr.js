define(['plugins/dialog', 'knockout','calendar/fullCalendar','./reservemr'], function (dialog, ko,fullCalendar,reservemr) {
            var baseUrl=appConfig.app.baseUrl;
            var getMethod=appConfig.app.getMethod;
            var saveMethod=appConfig.app.saveMethod;
            var ucode = appConfig.app.ucode;
            var user  = appConfig.app.user;
            var dbs=new dbHelper(baseUrl,user,ucode);
            var resid=appConfig.meetingroom.resid;
            var subresid=appConfig.meetingroom.subresid;
            var poresid=appConfig.meetingroom.poresid;
            var cmswhere="";
            var city;
            var building;
            var floor;
            var newDate;
            var yyyy;
            var mm;
            var dd;
            var mid;
            var eventJson;
    var carendarmr = function() {
        jQuery(document).ready(function() { //日历控件
            var date = new Date();
		        dd = date.getDate();
		        mm = date.getMonth()+1;
		        yyyy = date.getFullYear();
            
            var reserve=function(){
                mn=mm+1;
                cmswhere="mid='"+mid+"' AND month='"+yyyy+""+mm+"' OR month='"+yyyy+""+mn+"'";
                // dbs.dbGetdata(subresid,0,cmswhere,fnSuccess,null,null)
                var f3svc_sql='select  mid,title ,start, endtime as [end], month, allDay,total   from CT531240746615 where '+cmswhere;
                dbs.dbGetLittleDataBysql (subresid, f3svc_sql, fnSuccess, null, null)
                console.log(f3svc_sql);
                function fnSuccess(Json){
                    // for(var i = 0; i < Json.length; i++){
                    //     Json[i].end=(Json[i]).endtime;
                    // }
                    eventJson=Json;
                };
                return eventJson;
            };
            reserve();
            setTimeout(function() {
                var calendar = jQuery('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    buttonText: {
                        prev: 'prev',
                        next: 'next',
                        prevYear: '&nbsp;&lt;&lt;&nbsp;',
                        nextYear: '&nbsp;&gt;&gt;&nbsp;',
                        today: 'today',
                        month: 'month',
                        week: 'week',
                        day: 'day'
                    },
                    height:500,
                    slotEventOverlap:false,
                    weekMode:"liquid",
                    selectable:true,
                    dayClick: function(date) {
                        yyyy=date.getFullYear();
                        mm=date.getMonth()+1;
                        dd=date.getDate();
                        $('#calendar').fullCalendar( 'gotoDate', yyyy,mm-1,dd );
                        $('#calendar').fullCalendar('changeView','agendaDay');
                    },
                    events:eventJson
                });
            }, 350);
        });
    }
    carendarmr.prototype.cancel = function() {
        dialog.close(this);              
    };
    carendarmr.prototype.ok = function() {
        reservemr.show(mid,yyyy,mm,dd);
        //var that=this;
        //dialog.close(that);
    };
    carendarmr.prototype.attached=function(){
       
    };
   

    carendarmr.show = function(mdata){
        mid=mdata;
        return dialog.show(new carendarmr());
    };
    
    return carendarmr;
});