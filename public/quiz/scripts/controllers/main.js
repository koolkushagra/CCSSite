'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('testApp')
  .controller('MainCtrl', function ($scope, $http, $route) {
    $scope.totalQuestions = 0;
    $scope.attemptedQuestions = 0;
    $scope.unattemptedQuestions = 0;
    $scope.percentAnswered = $scope.attemptedQuestions/$scope.totalQuestions*100 + '%';
    $scope.currentQuestionNumber = 0;
    $scope.$route = $route;

    $scope.questionPaper = [];
    $scope.currentQuestion = [];

    $http.get('/quiz/getdata').
	  then(function(response) {
	     $scope.questionPaper = response.data;
	     $scope.currentQuestion = $scope.questionPaper[0];
	     $scope.totalQuestions = $scope.unattemptedQuestions = $scope.questionPaper.length;
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

  });
