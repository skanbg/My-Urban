/**
 * Activities view model
 */

var app = app || {};

app.Locals = (function () {
    'use strict'

    // Reports model
    var localsModel = (function () {

        var localModel = {

            id: 'Id',
            fields: {
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                Position: {
                    field: 'Position',
                    defaultValue: {
                        longitude: 0,
                        latitude: 0
                    }
                },
                PlaceName: {
                    field: 'PlaceName',
                    defaultValue: ''
                },
                Type: {
                    field: 'Type',
                    defaultValue: ''
                }
            }
        };

        // Activities data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var localsDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: localModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Locals'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-reports-span').hide();
                } else {
                    $('#no-reports-span').show();
                }
            },
            sort: {
                field: 'CreatedAt',
                dir: 'desc'
            }
        });

        return {
            locals: localsDataSource
        };

    }());

    // Reports view model
    var localsDataSource = (function () {

        // Navigate to activityView When some activity is selected
        var localSelected = function (e) {
            app.mobileApp.navigate('views/localView.html?uid=' + e.data.uid);
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
            locals: localsModel.locals,
            localSelected: localSelected,
            logout: logout
        };

    }());

    return localsDataSource;

}());