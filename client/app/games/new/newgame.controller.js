'use strict';

angular.module('games')
.controller('NewGameController', ['$scope', 'gameService', 'userService', function ($scope, gameService, userService) {
    $scope.forms = {
        newGameForm: { }
    };

    angular.extend($scope, {
        game: {
            name: null,
            variant: 'Standard',
            movementType: 'clock',
            movementClock: 1440,
            visibility: 'public',
            press: 'white',
            minimumScoreToJoin: 0,
            playerID: userService.getCurrentUser()
        }
    });

    gameService.getAllVariantNames()
        .then(function(variants) {
            $scope.variants = variants;
        });

    $scope.minimumPointsToGM = 10;

    userService.getUser(userService.getCurrentUser())
        .then(function(user) {
            $scope.points = user.points;
        });

    $scope.hasDecentScore = function() {
        return $scope.points >= $scope.minimumPointsToGM;
    };

    $scope.canExitStep1 = function() {
        return $scope.forms.newGameForm.gamename.$valid;
    };

    $scope.onWizardFinished = function() {
        gameService.createNewGame($scope.game);
    };

    // $scope.loadVariant = function(variant) {
    //     var variant = gameService.getVariant(variant.toLowerCase().replace(/\s/g,''));
    // };
}]);