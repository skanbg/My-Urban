/**
 * Activities view model
 */

var app = app || {};

app.Reports = (function () {
    'use strict'

    // Reports model
    var reportsModel = (function () {

        var reportModel = {

            id: 'Id',
            fields: {
                Description: {
                    field: 'Description',
                    defaultValue: ''
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                Image: {
                    fields: 'Picture',
                    defaultValue: null
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: null
                }
            },
            CreatedAtFormatted: function () {
                return app.helper.formatDate(this.get('CreatedAt'));
            },
            PictureUrl: function () {
                return app.helper.resolvePictureUrl(this.get('Image'));
            },
            User: function () {

                var userId = this.get('UserId');

                var user = $.grep(app.Users.users(), function (e) {
                    return e.Id === userId;
                })[0];

                return user ? {
                    DisplayName: user.DisplayName,
                    PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture)
                } : {
                    DisplayName: 'Anonymous',
                    PictureUrl: app.helper.resolveProfilePictureUrl()
                };
            },
            isVisible: function () {
                var currentUserId = app.Users.currentUser.data.Id;
                var userId = this.get('UserId');

                return currentUserId === userId;
            }
        };

        // Activities data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var reportsDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: reportModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Report'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-reports-span').hide();
                } else {
                    $('#no-reports-span').show();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });

        return {
            reports: reportsDataSource
        };

    }());

    // Reports view model
    var reportsViewModel = (function () {

        // Navigate to activityView When some activity is selected
        var reportSelected = function (e) {

            //app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function () {

            app.helper.logout()
            .then(navigateHome, function (err) {
                app.showError(err.message);
                navigateHome();
            });
        };

        return {
            reports: reportsModel.reports,
            reportSelected: reportSelected,
            logout: logout
        };

    }());

    return reportsViewModel;

}());
