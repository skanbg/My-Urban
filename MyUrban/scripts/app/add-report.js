var app = app || {};

app.AddReport = (function () {
    'use strict';

    function readImage(input, callback) {
        var FR = new FileReader();
        FR.onload = function (e) {
            var binaryString = e.target.result;
            callback(btoa(binaryString));
        };
        FR.readAsBinaryString(input[0].files[0]);
    }

    var addReportViewModel = (function () {

        var $reportDescription;
        var $reportImage;
        var validator;

        var init = function () {
            validator = $('#enterStatus').kendoValidator().data('kendoValidator');
            $reportDescription = $('#problemDescription');
            $reportImage = $('#newImage');
        };

        var show = function () {

            //Clear field on view show
            $reportDescription.val('');
            $('#outputImg')[0].src = '';
            cameraImg = '';
            validator.hideMessages();
        };

        var cameraImg = '';

        var saveReport = function () {

            //// Validating of the required fields
            if (validator.validate()) {
                if (cameraImg && cameraImg !== '') {
                    app.helper.createImage(cameraImg, function (uploadedImage) {
                        saveData(uploadedImage);
                    });
                } else {
                    saveData();
                }
            } else {
                navigator.notification.alert('Please fill all fields and upload a picture!', function () {}, 'Incorrect data', 'Ok');
            }
        };

        var saveData = function (uploadedImage) {
            var reports = app.Reports.reports;
            var report = reports.add();
            report.Description = $reportDescription.val();
            report.UserId = app.Users.currentUser.get('data').Id;
            if (uploadedImage && uploadedImage.result) {
                report.Image = uploadedImage.result.Id;
            }

            reports.one('sync', function () {
                app.mobileApp.navigate('#:back');
            });

            reports.sync();
        }

        function onSuccess(imageData) {
            cameraImg = imageData;
            $('#outputImg')[0].src = "data:image/jpeg;base64," + cameraImg;
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }

        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveReport: saveReport,
            capture: function () {
                navigator.camera.getPicture(onSuccess, onFail, {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            },
            upload: function () {
                readImage($reportImage, function (imageData) {
                    onSuccess(imageData);
                    cameraImg = imageData;
                });
            }
        };

    }());

    return addReportViewModel;

}());