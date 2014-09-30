/**
 * Activities view model
 */

var app = app || {};

app.Weather = (function () {
    'use strict'

    // Reports view model
    var weather = (function () {
        var weatherImage = 'http://www.northwestcollegerugby.com/app_images/weather_icons/rain.png';
        var rainSound = 'http://www.soundjay.com/nature/rain-06.wav';

        var $weatherInput,
            data = {
                something: 'asd'
            };

        var init = function () {
            $weatherInput = $('#weatherType');
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    loadData(position);
                    playMusic();
                },
                onError);
        };

        var playMusic = function () {
            var media = new Media(rainSound, function () {
                    console.log("playAudio():Audio Success");
                },
                function (err) {
                    console.log("playAudio():Audio Error: " + err);
                });
            media.play();
        };

        function updateData(updatedData) {
            data = updatedData;
        }

        var loadData = function (position) {
            $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude, function (updatedData) {
                data = updatedData;
            });
        }

        var onError = function (something) {
            navigator.notification.vibrate(1000);
            navigator.notification.alert('MyUrban cant load your current location!', function () {
                app.mobileApp.navigate('#:back');
            }, 'Device misconfiguration', 'Ok');
        };

        var show = function () {
            $weatherInput.empty();
        };

        return {
            init: init,
            show: show,
            data: data
        };
    }());

    return weather;
}());