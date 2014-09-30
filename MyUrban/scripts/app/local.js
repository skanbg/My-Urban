/**
 * Activity view model
 */

var app = app || {};

app.Local = (function () {
    'use strict'

    var $commentsContainer,
        listScroller;

    var activityViewModel = (function () {

        var activityUid,
            activity,
            $activityPicture;

        var init = function () {
            $commentsContainer = $('#comments-listview');
            $activityPicture = $('#picture');
        };

        var mapInitialization = function () {
            var deviceWidth = $(window).width();
            var deviceHeight = $(window).height();
            this.Map = 'http://maps.googleapis.com/maps/api/staticmap?center=' + this.Position.latitude + ',' + this.Position.longitude + '&zoom=' + this.mapZoom + '&size=' + deviceWidth + 'x' + deviceHeight + '&key=AIzaSyDgThF-dMiA5A0UsO1I8DVDnhM-h4rZraI';
            $('#map-canvas').attr("src", this.Map);
        }

        var attachMapEvents = function () {
            if (activity.zoomIn) {
                return;
            }

            activity.mapZoom = 12;
            activity.zoomIn = zoomIn;
            activity.zoomOut = zoomOut;
            activity.mapInitialization = mapInitialization;
            activity.mapInitialization();
        }

        var zoomIn = function () {
            if (this.mapZoom <= 20) {
                this.mapZoom++;
                this.mapInitialization();
            }
        }

        var zoomOut = function () {
            if (this.mapZoom >= 2) {
                this.mapZoom--;
                this.mapInitialization();
            }
        }

        var show = function (e) {

            $commentsContainer.empty();
            listScroller = e.view.scroller;
            listScroller.reset();

            activityUid = e.view.params.uid;
            // Get current activity (based on item uid) from Activities model
            activity = app.Locals.locals.getByUid(activityUid);
            //$activityPicture[0].style.display = activity.Picture ? 'block' : 'none';

            attachMapEvents();

            //app.Comments.comments.filter({
            //                field: 'ActivityId',
            //              operator: 'eq',
            //            value: activity.Id
            //      });

            kendo.bind(e.view.element, activity, kendo.mobile.ui);
        };

        return {
            init: init,
            show: show,
            activity: function () {
                return activity;
            }
        };

    }());

    return activityViewModel;

}());