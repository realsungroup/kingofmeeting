define(['plugins/dialog', 'knockout','calendar/fullCalendar','./reservemr','./editreserve'], function (dialog, ko,fullCalendar,reservemr,editreserve) {
    var baseUrl = appConfig.app.baseUrl;
    var getMethod = appConfig.app.getMethod;
    var saveMethod = appConfig.app.saveMethod;
    var ucode = appConfig.app.ucode;
    var user  = appConfig.app.user;
    var dbs = new dbHelper(baseUrl,user,ucode);
    var subresid = appConfig.meetingroom.subresid;
    var yyyy,mm,dd,yyyyn,mn,yyyyp,mp,y,m,d,mid,teleq,soundeq,projector,wboard,tel,mpnum,eventJson,cmswhere,f3svc_sql,date = new Date();
    var thenfn = function(){//then函数
        dbs.dbGetLittleDataBysql(subresid, f3svc_sql, fnSuccess);
        function fnSuccess(Json){
            objCalendar.events=Json;
             $('#calendar').fullCalendar("destroy");//销毁id日历，把日历回复到初始化前状态。
             $('#calendar').fullCalendar(objCalendar);//重新加载
        };
    }
    var objCalendar={//日历初始化状态对象
        header: {
            left: 'prev,next today',//日历头部左侧控件
            center: 'title',//日历头部中间控件
            right: 'month,agendaWeek,agendaDay'//日历头部右侧控件
        },
        buttonText: {//按钮文字样式
            prev: 'prev',
            next: 'next',
            today: 'today',
            month: 'month',
            week: 'week',
            day: 'day'
        },
        height:500,//日历高度
        slotEventOverlap: false,//设置视图中的事件显示是否可以重叠覆盖
        weekMode: "liquid",//在月视图里显示周的模式，因为每月周数可能不同，所以月视图高度不一定。fixed：固定显示6周高，日历高度保持不变;iquid：不固定周数，高度随周数变化;variable：不固定周数，但高度固定
        //selectable: true,//是否允许用户通过单击或拖动选择日历中的对象，包括天和时间。
        dayClick: function(date) {//当单击日历中的某一天时,触发此操作
            y=date.getFullYear();
            m=date.getMonth();
            d=date.getDate();
            $('#calendar').fullCalendar( 'gotoDate', y,m,d );//指定进入日历中的某一天
            $('#calendar').fullCalendar('changeView','agendaDay');//切换“日”视图
        },
        eventClick: function(event, jsEvent, view) {//当点击日历中的某一日程（事件）时，触发此操作
            editreserve.show(event).then(function(){
                thenfn();
            });
        },
        events:null
    };
    var carendarmr = function() {
        jQuery(document).ready(function() { //日历控件
		    yyyy = date.getFullYear();//获取当前系统时间：年、月、日，并通过月份判断，上一个月&年，下一个月&年
		    mm = date.getMonth();
		    dd = date.getDate();
            if(mm==11){
                mm++;
                mp=mm-1;
                mn=1;
                yyyyp=yyyy;
                yyyyn=yyyy+1;
            }else if(mm==0){
                mm++;
                mp=12;
                mn=mm+1;
                yyyyp=yyyy-1;
                yyyyn=yyyy;
            }else{
                mm++;
                mn=mm+1;
                mp=mm-1;
                yyyyp=yyyy;
                yyyyn=yyyy;
            }
            cmswhere = "mid='"+mid+"' AND (month='"+yyyy+""+mm+"' OR month='"+yyyyp+""+mp+"' OR month='"+yyyyn+""+mn+"') AND isnull(remove,'')<>'Y'";
            //sql语言
            f3svc_sql="select case when REC_CRTID='"+user+"' then 'classofme' else 'classofothers'  end as [className], rec_id as [id], mid,title ,start, endtime as [end], month, allDay,total   from CT531240746615 where "+cmswhere;
            dbs.dbGetLittleDataBysql (subresid, f3svc_sql, fnSuccess, null, null);//连接数据库,并获取数据
            function fnSuccess(Json){
                //console.log(Json);
                objCalendar.events=Json;//对日历中预定情况赋初始值
            };
            setTimeout(function() {
                var calendar = jQuery('#calendar').fullCalendar(objCalendar);//日历加载
            }, 350);
        });
    }
    carendarmr.prototype.cancel = function() {//退出按钮
        dialog.close(this);              
    };
    carendarmr.prototype.ok = function() {//我要预定按钮
        reservemr.show(mid,y,m,d).then(function(){
            thenfn();
        });
    };
    carendarmr.prototype.attached=function(){
        var listeq='容纳人数:<i>'+mpnum+'</i>电话:<i>'+tel+'</i>电话会议设备:<i>'+teleq+'</i>扩音设备:<i>'+soundeq+'</i>投影仪:<i>'+projector+'</i>白板:<i>'+wboard+'</i>'
        $('.calendarFoot1').append(listeq);//动态添加备注信息
    };
    carendarmr.show = function(mdata){
        mid=mdata.mid;//会议室编号
        mpnum=mdata.mpnum;//容纳人数
        tel=mdata.tel;//电话号码
        teleq=mdata.teleq;//是否有电话设备
        soundeq=mdata.soundeq;//是否有扩音设备
        projector=mdata.projector;//是否有投影仪
        wboard=mdata.wboard;//是否有白板
        return dialog.show(new carendarmr());//弹出页面
    };
    
    return carendarmr;
});