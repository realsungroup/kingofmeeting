define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {
            router.map([
                { route: '', title:'欢迎', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'dinnerlist',title:'开始', moduleId: 'viewmodels/dinnerlist', nav: true },
                { route: 'addmr',title:'新增会议室', moduleId: 'viewmodels/addmr', nav: true },
                { route: 'selectmeeting',title:'会议预定', moduleId: 'viewmodels/selectmeeting', nav: true },
                { route: 'editmeeting',title:'会议编辑', moduleId: 'viewmodels/editmeeting', nav: true },
                { route: 'count',title:'统计', moduleId: 'viewmodels/count', nav: true }
            ]).buildNavigationModel();
           
            return router.activate();
        }
    };
});