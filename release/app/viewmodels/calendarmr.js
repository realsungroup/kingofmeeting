define(['plugins/dialog', 'knockout','calendar/fullCalendar','./reservemr','./editreserve'], function (dialog, ko,fullCalendar,reservemr,editreserve) {
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
            var city,building,floor,newDate,yyyy,mm,dd,mn,mid,teleq,soundeq,projector,wboard,tel,mpnum;
            var eventJson;
            var objCalendar={
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
                    slotEventOverlap: false,
                    weekMode: "liquid",
                    selectable: true,
                    dayClick: function(date) {
                        yyyy=date.getFullYear();
                        mm=date.getMonth()+1;
                        dd=date.getDate();
                        $('#calendar').fullCalendar( 'gotoDate', yyyy,mm-1,dd );
                        $('#calendar').fullCalendar('changeView','agendaDay');
                    },
                    eventClick: function(event, jsEvent, view) {
                        //console.log(event);
                        editreserve.show(event).then(function(r){
           
                            cmswhere="mid='"+mid+"' AND (month='"+yyyy+""+mm+"' OR month='"+yyyy+""+mn+"') AND isnull(remove,'')<>'Y'";
                             var f3svc_sql="select case when REC_CRTID='"+appConfig.app.user+"' then 'classofme' else 'classofothers'  end as [className], rec_id as [id], mid,title ,start, endtime as [end], month, allDay,total   from CT531240746615 where "+cmswhere;
                            dbs.dbGetLittleDataBysql (subresid, f3svc_sql, fnSuccess, null, null)
                            //console.log(f3svc_sql);
                            function fnSuccess(Json){
                                objCalendar.events=Json;
                                 $('#calendar').fullCalendar("destroy");
                                 $('#calendar').fullCalendar(objCalendar);
                            };
                        });
                    },
                    events:null
                };
    var carendarmr = function() {
        jQuery(document).ready(function() { //日历控件
            var date = new Date();
		    dd = date.getDate();
		    mm = date.getMonth()+1;
		    yyyy = date.getFullYear();
            mn=mm+1;
            cmswhere="mid='"+mid+"' AND (month='"+yyyy+""+mm+"' OR month='"+yyyy+""+mn+"') AND isnull(remove,'')<>'Y'";
            // dbs.dbGetdata(subresid,0,cmswhere,fnSuccess,null,null)
             var f3svc_sql="select case when REC_CRTID='"+appConfig.app.user+"' then 'classofme' else 'classofothers'  end as [className], rec_id as [id], mid,title ,start, endtime as [end], month, allDay,total   from CT531240746615 where "+cmswhere;
            dbs.dbGetLittleDataBysql (subresid, f3svc_sql, fnSuccess, null, null)
            //console.log(f3svc_sql);
            function fnSuccess(Json){
                objCalendar.events=Json;
            };
            setTimeout(function() {
                var calendar = jQuery('#calendar').fullCalendar(objCalendar);
            }, 350);
        });
    }
    carendarmr.prototype.cancel = function() {
        dialog.close(this);              
    };
    carendarmr.prototype.ok = function() {
        reservemr.show(mid,yyyy,mm,dd).then(function(r){
           
                cmswhere="mid='"+mid+"' AND (month='"+yyyy+""+mm+"' OR month='"+yyyy+""+mn+"') AND isnull(remove,'')<>'Y'";
                 var f3svc_sql="select case when REC_CRTID='"+appConfig.app.user+"' then 'classofme' else 'classofothers'  end as [className], rec_id as [id], mid,title ,start, endtime as [end], month, allDay,total   from CT531240746615 where "+cmswhere;
                dbs.dbGetLittleDataBysql (subresid, f3svc_sql, fnSuccess, null, null)
                //console.log(f3svc_sql);
                function fnSuccess(Json){
                   
                    objCalendar.events=Json;
                     $('#calendar').fullCalendar("destroy");
                     $('#calendar').fullCalendar(objCalendar);
                   
                };
           


        });
        //var that=this;
        //dialog.close(that);
    };
    carendarmr.prototype.attached=function(){
        var listeq='容纳人数:<i>'+mpnum+'</i>电话:<i>'+tel+'</i>电话会议设备:<i>'+teleq+'</i>扩音设备:<i>'+soundeq+'</i>投影仪:<i>'+projector+'</i>白板:<i>'+wboard+'</i>'
        $('.calendarFoot1').append(listeq);
    };
   

    carendarmr.show = function(mdata){
        mid=mdata.mid;
        teleq=mdata.teleq;
        soundeq=mdata.soundeq;
        projector=mdata.projector;
        wboard=mdata.wboard;
        mpnum=mdata.mpnum;
        tel=mdata.tel;
        return dialog.show(new carendarmr());
    };
    
    return carendarmr;
});