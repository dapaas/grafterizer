'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:FilesCtrl
 * @description
 * # FilesCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('FilesCtrl', function ($scope, File) {
  	File.find({
  		"filter[fields][content]": false,
      "filter[order]": "date DESC"
  	}, function(list){
      var period = null;
      var now = new Date();
      list.forEach(function(file) {
        var fileMoment = moment(file.date);
        var tmpPeriod;
        if (fileMoment.isSame(now, "day")) {
          tmpPeriod = "Today";
        } else {
          tmpPeriod = fileMoment.fromNow();
        }
        if (period !== tmpPeriod) {
          file.period = period = tmpPeriod;
        }
      });
  		$scope.files = list;
  	}, function(){
  		console.log("pas glop");
  	});
  });
