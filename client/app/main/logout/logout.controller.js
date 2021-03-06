'use strict';

angular.module('diplomacy.main')
.controller('LogoutController', ['userService', 'socketService', '$state', function(userService, socketService, $state) {
    // clear token
    userService.unsetToken();

    // disconnect socket
    if (socketService.socket)
        socketService.socket.disconnect();
    socketService.socket = null;

    $state.go('main.home');
}]);
