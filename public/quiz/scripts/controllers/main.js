'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('testApp')
  .controller('MainCtrl', function ($scope, $http, $route, $timeout, $location) {
    $scope.totalQuestions = 0;
    $scope.attemptedQuestions = 0;
    $scope.unattemptedQuestions = 0;
    $scope.percentAnswered = $scope.attemptedQuestions/$scope.totalQuestions*100 + '%';
    $scope.currentQuestionNumber = 0;
    $scope.$route = $route;
    //$scope.timeToSubmit = 902000;
    $scope.setTime = false;
    if($scope.setTime)
    {
    	$scope.techOne = true;
    	$scope.nonTechOne = false;
    	$scope.timeToSubmit = 902000;
    }
    else
    {
    	$scope.techOne = false;
    	$scope.nonTechOne = true;
    	$scope.timeToSubmit = 602000;	
    }
    $scope.questionPaper = [];
    $scope.currentQuestion = [];

    $http.get('/quiz/getdata').
	  then(function(response) {
	     $scope.questionPaper = response.data;
	     $scope.currentQuestion = $scope.questionPaper[0];
	     $scope.totalQuestions = $scope.unattemptedQuestions = $scope.questionPaper.length;
	     for (var i = $scope.questionPaper.length - 1; i >= 0; i--) {
				$scope.questionPaper[i].qno = i+1;
		}
	  }, function(response) {
	    $scope.questionPaper = null;
  	});

	$scope.selectQuestion = function(questionNumber) {
		if(questionNumber<0||questionNumber>=$scope.questionPaper.length)
			{return;}

		$scope.currentQuestion = $scope.questionPaper[questionNumber];
		$scope.currentQuestionNumber = questionNumber;
		$scope.attemptedQuestions = 0;
		for (var i = $scope.questionPaper.length - 1; i >= 0; i--) {
			if($scope.questionPaper[i].answer)
				{$scope.attemptedQuestions++;}
		}
		$scope.unattemptedQuestions = $scope.totalQuestions - $scope.attemptedQuestions;
		$scope.percentAnswered = $scope.attemptedQuestions/$scope.totalQuestions*100 + '%';
	};

	$scope.setAnswer = function(Answer) {
		if(!($scope.currentQuestion.answer)) {
			$scope.unattemptedQuestions--;
			$scope.attemptedQuestions++;
		}
		$scope.percentAnswered = $scope.attemptedQuestions/$scope.totalQuestions*100 + '%';
		$scope.currentQuestion.answer = Answer;
	};

	this.mainScope = function() {
		return $scope;
	};

	$scope.submit = function () {
    $http({
        method: 'POST',
        url: '/quiz/correct',
        data: $scope.questionPaper,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }).then(function() {

    },
    function(){});
    console.log("Check");
    window.location.replace("/home");
	};

	$timeout(function() {
		$scope.submit();
	}, $scope.timeToSubmit);

  });
