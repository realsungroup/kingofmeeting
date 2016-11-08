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
                { route: '', title:'预定会议室', moduleId:  'viewmodels/selectmeeting', nav: true },
                { route: 'addmr', title:'新增会议室', moduleId:  'viewmodels/addmr', nav: true },
                { route: 'editmeeting', title:'编辑会议室', moduleId:  'viewmodels/editmeeting', nav: true } 
                
            ]).buildNavigationModel();
           
            return router.activate();
        }
    };
});