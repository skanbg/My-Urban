var app = app || {};

app.AddPlace = (function () {
    'use strict';

    var addReportViewModel = (function () {

        var $placeName;
        var $placeType;
        var validator;

        var init = function () {
            validator = $('#enterStatus').kendoValidator().data('kendoValidator');
            $placeName = $('#placeName');
            $placeType = $('#placeType');
        };

        var show = function () {

            //Clear field on view show
            $placeName.val('');
            $placeType.val('');
            validator.hideMessages();
        };

        var onSuccess = function (position) {
            var locals = app.Locals.locals;
            var place = locals.add();
            place.PlaceName = $placeName.val();
            place.Type = $placeType.val();
            place.UserId = app.Users.currentUser.get('data').Id;
            place.Position = {
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
            };

            locals.one('sync', function () {
                app.mobileApp.navigate('#:back');
            });

            locals.sync();
            navigator.notification.beep(5);
        }
        
        var onError = function(something){
            console.log(something);
            navigator.notification.vibrate(1000);
            navigator.notification.alert('MyUrban cant load your current location!', function(){
                app.mobileApp.navigate('#:back');
            }, 'Device misconfiguration', 'Ok');
        };

        var savePlace = function () {

            //// Validating of the required fields
            if (validator.validate()) {
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            } else {
                navigator.notification.alert('Please fill all fields!', function () {}, 'Incorrect data', 'Ok');
            }
        };

        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            savePlace: savePlace
        };

    }());

    return addReportViewModel;

}());