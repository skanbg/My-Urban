var app = app || {};

app.AddReport = (function () {
    'use strict'

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
            validator.hideMessages();
        };

        var saveReport = function () {

            //// Validating of the required fields
            if (validator.validate()) {
                readImage($reportImage, function (imageData) {
                    app.helper.createImage(imageData, function (uploadedImage) {
                        var reports = app.Reports.reports;
                        var report = reports.add();
                        report.Description = $reportDescription.val();
                        report.UserId = app.Users.currentUser.get('data').Id;
                        report.Image = uploadedImage.result.Id;
                        console.log(uploadedImage.result);

                        reports.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });

                        reports.sync();
                    });
                });
            }
        };

        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveReport: saveReport
        };

    }());

    return addReportViewModel;

}());