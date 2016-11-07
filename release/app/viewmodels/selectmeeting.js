define(['plugins/http', 'durandal/app', 'knockout','durandal/system','plugins/router','./calendarmr','./reservemr','plugins/dialog','calendar/fullcalendar'], function (http, app, ko,system,router,calendarmr,reservemr,dialog,fullcalendar) {
            baseUrl=appConfig.app.baseUrl;
            getMethod=appConfig.app.getMethod;
            saveMethod=appConfig.app.saveMethod;
            var me=this;
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
    gomeeting=function(self,city,building,floor){//页面输出
        if(building===undefined&&floor===undefined){
            cmswhere="city='"+city+"'";
        }else if(building!=undefined&&floor===undefined){
            cmswhere="city='"+city+"' AND fname='"+building+"'";
        }else if(building===undefined&&floor!=undefined){
            cmswhere="city='"+city+"' AND floor='"+floor+"'";
        }else{
            cmswhere="city='"+city+"' AND fname='"+building+"' AND floor='"+floor+"'";
        }
        dbs.dbGetdata(resid,0,cmswhere,fnSuccess,null,fnhttperror);
        function fnSuccess(data){
            self.mlist(data);
 
        }
        function fnhttperror(jqXHR, textStatus, errorThrown){
            //console.log(jqXHR);
        }
	};
    return {
		activate:function(){},
        attached:function(){
        
            calendar=function(mdata){
                mid=mdata.mid;
                calendarmr.show(mid);
            };     
            (function($) {
              
                    function Collapse (el, options) {
                        options = options || {};
                        var _this = this,
                        query = options.query || "> :even";
              
                        $.extend(_this, {
                            $el: el,
                            options : options,
                            sections: [],
                            isAccordion : options.accordion || false,
                            db : options.persist ? jQueryCollapseStorage(el[0].id) : false
                        });
            
                        _this.states = _this.db ? _this.db.read() : [];
            
                        _this.$el.find(query).each(function() {
                            var section = new Section($(this), _this);
                            _this.sections.push(section);

                            var state = _this.states[section._index()];
                            if(state === 0) {
                              section.$summary.removeClass("open");
                            }
                            if(state === 1) {
                              section.$summary.addClass("open");
                            }

                            if(section.$summary.hasClass("open")) {
                              section.open(true);
                            }
                            else {
                              section.close(true);
                            }
                        });
            
                        (function(scope) {
                            _this.$el.on("click", "[data-collapse-summary]",
                            $.proxy(_this.handleClick, scope));
                        }(_this));
                    }  
          
                    Collapse.prototype = {
                        handleClick: function(e) {
                            e.preventDefault();
                            var sections = this.sections,
                            l = sections.length;
                            while(l--) {
                                if($.contains(sections[l].$summary[0], e.target)) {
                                    sections[l].toggle();
                                    break;
                                }
                            }
                        },
                        open : function(eq) {
                            if(isFinite(eq)) return this.sections[eq].open();
                            $.each(this.sections, function() {
                              this.open();
                            });
                        },
                        close: function(eq) {
                            if(isFinite(eq)) return this.sections[eq].close();
                            $.each(this.sections, function() {
                                this.close();
                            });
                        }
                    };
          
                    function Section($el, parent) {
                        $.extend(this, {
                            isOpen : false,
                            $summary : $el.attr("data-collapse-summary", "").wrapInner('<a href="#"/>'),
                            $details : $el.next(),
                            options: parent.options,
                            parent: parent
                        });
                    }
          
                    Section.prototype = {
                        toggle : function() {
                            if(this.isOpen) this.close();
                            else this.open();
                        },
                        close: function(bypass) {
                            this._changeState("close1", bypass);
                        },
                        open: function(bypass) {
                            var _this = this;
                            if(_this.options.accordion && !bypass) {
                              $.each(_this.parent.sections, function() {
                                this.close();
                              });
                            }
                            _this._changeState("open", bypass);
                        },
                        _index: function() {
                            return $.inArray(this, this.parent.sections);
                        },
                        _changeState: function(state, bypass) {
                          
                            var _this = this;
                            _this.isOpen = state == "open";
                            if($.isFunction(_this.options[state]) && !bypass) {
                                _this.options[state].apply(_this.$details);
                            } else {
                                if(_this.isOpen) _this.$details.show();
                                else _this.$details.hide();
                            }
                            _this.$summary.removeClass("open close1").addClass(state);
                            _this.$details.attr("aria-hidden", state == "close1");
                            _this.parent.$el.trigger(state, _this);
                            if(_this.parent.db) {
                                _this.parent.db.write(_this._index(), _this.isOpen);
                            }
                        }
                    };
          
                    $.fn.extend({
                        collapse: function(options, scan) {
                            var nodes = (scan) ? $("body").find("[data-collapse]") : $(this);
                            return nodes.each(function() {
                                var settings = (scan) ? {} : options,
                                values = $(this).attr("data-collapse") || "";
                                $.each(values.split(" "), function(i,v) {
                                    if(v) settings[v] = true;
                                });
                            new jQueryCollapse($(this), settings);
                            });
                        }
                    });
          
                    $(function() {
                      $.fn.collapse(false, true);
                    });
                    jQueryCollapse = Collapse;
            })(window.jQuery);
            $("#example").collapse({
                accordion: true,
                open: function() {
                    this.addClass("open");
                    this.css({ height: "450px" });
                },
                close1: function() {
                    this.css({ height: "0px" });
                    this.removeClass("open");
                }
            });
            
        },
        mlist:ko.observableArray([]),
        cityfilterofsh:function(){//筛选城市
            city="上海";
            gomeeting(this,city);
        },
        cityfilterofwx:function(){//筛选城市
            city="无锡";
            gomeeting(this,city);
        },
        buildingfilterA:function(){//筛选幢
            building="A座";
            gomeeting(this,city,building,floor);
        },
        buildingfilterB:function(){//筛选幢
            building="B座";
            gomeeting(this,city,building,floor);
        },
        buildingfilterC:function(){//筛选幢
            building="C座";
            gomeeting(this,city,building,floor)
        },
        buildingfilterD:function(){//筛选幢
            building="D座";
            gomeeting(this,city,building,floor);
        },
        buildingfilterE:function(){//筛选幢
            building="E座";
            gomeeting(this,city,building,floor);
        },
        floorfilter6F:function(){//筛选楼层
            floor="6F";
            gomeeting(this,city,building,floor);
        },
        floorfilter5F:function(){//筛选楼层
            floor="5F";
            gomeeting(this,city,building,floor);
        },
        floorfilter4F:function(){//筛选楼层
            floor="4F";
            gomeeting(this,city,building,floor);
        },
        floorfilter3F:function(){//筛选楼层
            floor="3F";
            gomeeting(this,city,building,floor);
        },
        floorfilter2F:function(){//筛选楼层
            floor="2F";
            gomeeting(this,city,building,floor);
        },
        floorfilter1F:function(){//筛选楼层
            floor="1F";
            gomeeting(this,city,building,floor);
        },
        refresh:function(){
            gomeeting(this,city,building,floor);
        }
    }

  

});