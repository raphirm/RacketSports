'use strict';

// Matches controller
angular.module('matches').controller('MatchesController', ['$scope', '$stateParams', '$location', '$http', '$resource', 'Authentication', 'Matches', 'Users',
    function ($scope, $stateParams, $location, $http, $resource, Authentication, Matches, Users) {
        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        $scope.times = [{time: '', state: 'proposed'}];
        $scope.scores = [[{outcome: '', value: 0}, {outcome: '', value: 0}]];
        $scope.winner = '';
        $scope.suser = '';
        $scope.newMatches = '';
        $scope.propMatches = '';
        $scope.openMatches = '';
        $scope.r2cMatches = '';
        $scope.broadcastMatches = '';
        $scope.progressMatches = '';
        $scope.doneMatches = '';
        $scope.find = function () {
            var Resource = $resource('/users/me');
            Resource.get(function (user) {
                $scope.user = user;
            });
            Resource = $resource('/courts');
            Resource.query(function (courts) {
                $scope.courts = courts;
            });
            Resource = $resource('/matches/new');
            Resource.query(function (matches) {
                $scope.newMatches = matches;
            });
            Resource = $resource('/matches/proposed');
            Resource.query(function (matches) {
                $scope.propMatches = matches;
            });
            Resource = $resource('/matches/open');
            Resource.query(function (matches) {
                $scope.openMatches = matches;
            });
            Resource = $resource('/matches/broadcasts');
            Resource.query(function (matches) {
                $scope.broadcastMatches = matches;
            });
            Resource = $resource('/matches/inprogress');
            Resource.query(function (matches) {
                $scope.progressMatches = matches;
            });
            Resource = $resource('/matches/r2c');
            Resource.query(function (matches) {
                $scope.r2cMatches = matches;
            });
            Resource = $resource('/matches/done');
            Resource.query(function (matches) {
                $scope.doneMatches = matches;
            });

        };

        $scope.find();
        // Create new Match
        $scope.create = function () {
            // Create new Match object


            var match = new Matches({
                spieler: [
                    {user: $scope.user},
                    {
                        user: {
                            username: this.match.user.username
                        }
                    }
                ],
                court: this.match.court,
                sport: this.match.sport,
                state: 'new',
                proposedTimes: $scope.times
            });
            if(this.match.schedule)
            {
                match.schedule= this.match.schedule;
            }
            if(this.match.league){
                match.league = this.match.league
            }
            // Redirect after save
            match.$save(function (response) {
                $location.path('matches/');

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Match
        $scope.remove = function (match) {
            if (match) {
                match.$remove();

                for (var i in $scope.matches) {
                    if ($scope.matches [i] === match) {
                        $scope.matches.splice(i, 1);
                    }
                }
            } else {
                $scope.match.$remove(function () {
                    $location.path('matches');
                });
            }
        };
        $scope.addTime = function () {
            $scope.times.push({time: '', state: 'proposed'});
        };
        $scope.remTime = function (index) {
            $scope.times.splice(index, 1);
        };
        // Update existing Match
        $scope.update = function () {
            var match = $scope.match;

            match.$update(function () {
                $location.path('matches/' + match._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.addSet = function () {
            $scope.scores.push({outcome: '', value: 0});
        };
        $scope.remSet = function (index) {
            $scope.scores.splice(index, 1);
        };
        // Find a list of Matches
        $scope.find = function () {
            $scope.matches = Matches.query();

        };

        // Find existing Match
        $scope.findOne = function () {
            $scope.match = Matches.get({
                matchId: $stateParams.matchId
            });
        };
        $scope.findUser = function () {
            var Resource = $resource('/users/find', {user: $scope.suser});
            Resource.get(
                function (user) {
                    $scope.player2 = user;
                    $scope.user.friends.push(user);
                    $scope.match = {user: ''};
                    $scope.match.user = user;

                }, function (response) {

                    $scope.error = response.data.message;

                });

        };
        $scope.matchIsNew = function () {
            if ($scope.match.state === 'new'  &&  $scope.match.propBy != Authentication.user._id && $scope.match.spieler[1]) {
                return true;
            } else {
                return false;
            }
        };
        $scope.matchIsBroadcast = function () {
            if ($scope.match.state === 'new'  &&  !$scope.match.spieler[1]) {
                return true;
            } else {
                return false;
            }
        };
        $scope.matchIsOpen = function () {
            if ($scope.match.state === 'open') {
                return true;
            } else {
                return false;
            }
        };
        $scope.matchIsProposed = function () {
            if ($scope.match.state === 'proposed' &&  $scope.match.propBy != Authentication.user._id) {
                return true;
            } else {
                return false;
            }
        };
        $scope.matchIsInProgress = function () {
            if ($scope.match.state === 'progress' ) {
                return true;
            } else {
                return false;
            }
        };
        $scope.matchIsReshedule = function () {
            if ($scope.match.state == 'reshedule') {
                return true;
            } else {
                return false;
            }
        };
        $scope.matchIsR2C = function () {
            if ($scope.match.state == 'r2c' &&  $scope.match.r2cBy != Authentication.user._id) {
                return true;
            } else {
                return false;
            }
        };
        $scope.timeIsProposed = function (index) {
            if ($scope.match.proposedTimes[index].state == 'proposed') {
                return true;
            } else {
                return false;
            }
        };
        $scope.timeIsAgreed = function (index) {
            if ($scope.match.proposedTimes[index].state == 'agreed' ) {
                return true;
            } else {
                return false;
            }
        };
        $scope.sendProposals = function () {
            //sending Proposal
            $scope.match.state = 'proposed';
            for (var i = 0; i < $scope.match.proposedTimes.length; i++) {
                if ($scope.match.proposedTimes[i].state != 'agreed') {
                    $scope.match.proposedTimes.splice(i, 1);
                }
            }
            $scope.match.$update(function () {
                $location.path('matches/' + $scope.match._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.verifyTime = function (index) {
            $scope.match.proposedTimes[index].state = 'agreed';
        };
        $scope.unverifyTime = function (index) {
            $scope.match.proposedTimes[index].state = 'proposed';
        };
        $scope.matchToOpen = function () {
            $scope.match.state = 'open';
            $scope.match.$update(function () {
                $location.path('matches/' + $scope.match._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.matchToNew = function () {
            $scope.match.state = 'new';
            $scope.match.proposedTimes = $scope.times;
            $scope.match.$update(function () {
                $location.path('matches/' + $scope.match._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.matchToInProgress = function () {
            $scope.match.state = 'progress';
            $scope.match.spieler[0].sets = [];
            $scope.match.spieler[1].sets = [];
            $scope.match.$update(function () {
                $location.path('matches/' + $scope.match._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.matchReshedule = function () {
            $scope.match.state = 'reshedule';
            $scope.match.proposedTimes = [];
            $scope.match.$update(function () {
                $location.path('matches/' + $scope.match._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.matchToR2C = function () {
            $scope.match.state = 'r2c';
            if ($scope.winner.user == $scope.match.spieler[0].user) {
                $scope.match.spieler[0].outcome = 'win';
                $scope.match.spieler[1].outcome = 'loss';

            }
            if ($scope.winner.user == $scope.match.spieler[1].user) {
                $scope.match.spieler[1].outcome = 'win';
                $scope.match.spieler[0].outcome = 'loss';

            }
            for (var i = 0; i < $scope.scores.length; i++) {

                var spieler0num = $scope.scores[i][0].value;
                var spieler1num = $scope.scores[i][1].value;
                var spieler1out = '';
                var spieler0out = '';
                if ($scope.scores[i][0].value < $scope.scores[i][1].value && $scope.scores[i][0].value != $scope.scores[i][1].value) {
                    spieler1out = 'win';
                    spieler0out = 'loss';
                }
                if ($scope.scores[i][1].value < $scope.scores[i][0].value && $scope.scores[i][0].value != $scope.scores[i][1].value) {
                    spieler0out = 'win';
                    spieler1out = 'loss';
                }
                if ($scope.scores[i][0].value == $scope.scores[i][1].value) {
                    spieler1out = 'draw';
                    spieler0out = 'draw';
                }
                $scope.match.spieler[0].sets.push({value: spieler0num, outcome: spieler0out});
                $scope.match.spieler[1].sets.push({value: spieler1num, outcome: spieler1out});
            }
            $scope.match.$update(function () {
                $location.path('matches/' + $scope.match._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.matchToDone = function () {
            $scope.match.state = 'done';
            $scope.match.$update(function () {
                $location.path('matches/' + $scope.match._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.matchBroadcastToOpen = function() {
            $scope.match.spieler.push({user: $scope.user});
            $scope.match.state = 'open';
            $scope.match.$update(function () {
                $location.path('matches/' + $scope.match._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }

    }
]);
