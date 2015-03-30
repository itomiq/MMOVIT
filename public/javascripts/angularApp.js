var app = angular.module('MMOVIT', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$sceDelegateProvider',
    function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
        $stateProvider
        .state('home', {
            url: '/projects',
            templateUrl: '/projects.html',
            controller: 'ProjectsCtrl',
            resolve: {
                postPromise: ['projects', function(projects){
                    return projects.getAll();
                }]
            }
        });
        $stateProvider
        .state('project', {
            url: '/projects/{id}',
            templateUrl: '/transcripts.html',
            controller: 'TranscriptionCtrl',
            resolve: {
                project: ['$stateParams', 'projects', function($stateParams, projects) {
                    return projects.get($stateParams.id);
                }],
                modiService: ['$stateParams', 'modi', function($stateParams, modi){
                    return modi.getAll($stateParams.id);
                }],
                transcriptionService: ['$stateParams', 'transcripts', function($stateParams, transcripts){
                    return transcripts.getAll($stateParams.id);
                }],
            }
        });
        $stateProvider
        .state('edit', {
            url: '/projects/{projectid}/transcripts/{transcriptid}',
            templateUrl: '/editTranscript.html',
            controller: 'EditCtrl',
            resolve: {
                modiService: ['$stateParams', 'modi', function($stateParams, modi){
                    return modi.getAll($stateParams.projectid);
                }],
                transcript: ['$stateParams', 'transcripts', function($stateParams, transcripts) {
                    return transcripts.get($stateParams.projectid, $stateParams.transcriptid);
                }],
            }
        });

        $urlRouterProvider.otherwise('projects');

    }

]);

app.factory('projects', ['$http', function($http){
    var p = {
        projects: []
    }

    p.getAll = function(){
        return $http.get('/projects')
        .success(function(data){
            // console.log('projects ' , data);
            angular.copy(data, p.projects);
        });
    };

    p.get = function(projectid){
        // console.log('get a project reached for projectid ', projectid);
        return $http.get('/projects/' + projectid).then(function(res){
            return res.data;
        });
    };

    p.add = function(project){
        return $http.post('/projects', project).success(function(data){
            p.projects.push(data);
        });
    };

    p.update = function(project){
        return $http.post('/projects', project).success(function(data){
            for (var i=0; i<p.projects.length; i++){
                if (p.projects[i]._id == project._id){
                    p.projects.splice(i, 1, project);
                    break;
                };
            };
        });
    };

    p.trash = function(project){
        return $http.get('/projects/' + project._id +'/trash').success(function(data){
            for (var i=0; i<p.projects.length; i++){
                if (p.projects[i]._id == project._id){
                    p.projects.splice(i, 1);
                    break;
                };
            };
        });
    };

    return p;
}]);

app.factory('modi', ['$http', function($http){

    var m = {
        modi: []
    };

    m.getAll = function(projectid){
        return $http.get('/projects/' + projectid +'/modi')
        .success(function(data){
            // we kopieëren enkel die properties die 
            // ons interesseren: naam, descriptie en id
            // We voegen ook een sequence-nummer toe om later te kunnen sorteren
            m.modi = [];
            for (i=0; i<data.length; i++){
                var modus = {};
                modus._id = data[i]._id;
                modus.sequenceNumber = i;
                modus.modusName = data[i].modusName;
                modus.modusDescription = data[i].modusDescription;
                modus.project = data[i].project;
                m.modi.push(modus);
            };
        });
    };

    m.create = function(modus){
        return $http.post('/projects/' + modus.project + '/modi', modus)
        .success(function(data){
            var modus = {};
            modus._id = data._id;
            modus.sequenceNumber = m.modi.length;
            modus.modusName = data.modusName;
            modus.modusDescription = data.modusDescription;
            modus.project = data.project;
            m.modi.push(modus);
        })
    };

    m.update = function(modus){
        return $http.post('/projects/' + modus.project + '/modi', modus)
        .success(function(data){
            // we houden hier geen rekening met 'data'
            // want dat bevat het oude object
            for (var i = 0; i < m.modi.length; i++) {
                if (m.modi[i]._id == modus._id){
                    m.modi.splice(i, 1, modus);
                    break;
                }
            };
        })
    };

    m.trash = function(modus){
        return $http.post('/projects/' + modus.project + '/modi/trash', modus)
        .success(function(data){

            // verwijder het object in kwestie
            for (var i = 0; i < m.modi.length; i++) {
                if (m.modi[i]._id == modus._id){
                    m.modi.splice(i, 1);
                    break;
                };
            };

            // update de sequencenummers
            for (var i = 0; i < m.modi.length; i++) {
                m.modi[i].sequenceNumber = i;
            };

        });
    };

    return m;
}]);

app.factory('transcripts', ['$http', 'modi', function($http, modi){
    var o = {
        transcripts: []
    };

    transformDataObject = function(transcriptFromDb){
        var aTranscript = {};
        aTranscript._id = transcriptFromDb._id;
        aTranscript.project = transcriptFromDb.project;
        aTranscript.start = transcriptFromDb.start;
        aTranscript.modi = [];

        for (i=0; i<modi.modi.length; i++){
            var modus = {};
            modus.modusId = modi.modi[i]._id;
            modus.sequenceNumber = modi.modi[i].sequenceNumber;
            if (transcriptFromDb.modus == modi.modi[i]._id){
                modus.comment = transcriptFromDb.comment;
            } else {
                modus.comment = "";
            };
            aTranscript.modi.push(modus);
        };
        return aTranscript;
    };

    o.getAll = function(projectid) {
        return $http.get('/projects/' + projectid + '/transcripts')
        .success(function(data){
            o.transcripts = [];
            for (var i=0;i<data.length;i++){
                var transformedObject = transformDataObject(data[i]);
                o.transcripts.push(transformedObject);
            }
        });
    };

    o.get = function(projectid, id) {
        return $http.get('/projects/' + projectid + '/transcripts/' + id).then(function(res){
            // console.log(data);
            return transformDataObject(res.data);
        });
    };

    o.create = function(transcript){
        return $http.post('/projects/' + transcript.project + '/transcripts', transcript)
        .success(function(data){
            var transformedObject = this.transformDataObject(data);
            o.transcripts.push(transformedObject);
        });
    };

    o.trash = function(transcript){
        return $http.post('/projects/' + transcript.project + '/transcripts/' + transcript._id + '/trash', transcript)
        .success(function(data){
            for (var i=0; i<o.transcripts.length;i++){
                if (transcript._id == o.transcripts[i]._id){
                    o.transcripts.splice(i, 1);
                    break;
                };
            };
        });
    };

    o.update = function(transcript){
        return $http.post('/projects/' + transcript.project + '/transcripts/' + transcript._id + '/edit', transcript)
        .success(function(data){
            // remove old transcript from the array and add the new again
            for (var i=0; i < o.transcripts.length; i++ ){
                if (o.transcripts[i]._id == data._id){
                    o.transcripts.splice(i, 1, transformDataObject(transcript));
                    break;
                }
            }
        });
    };

    return o;
}]);

app.directive('mmovitVideo', ['$sce', function($sce) {
  return {
    restrict: 'A',
    // template: '<video src="{{videoFile}}" autobuffer autoloop loop controls ></video>',
    require: 'ngModel',
    // controller: function ($scope, $element) {

    //     $scope.onTimeUpdate = function () {
    //         console.log('currenttime has changed');
    //     }
    // },
    link: function(scope, element, attrs, ngModel){

        var skipBeforeInterval = 3;

        element[0].currentTime = ngModel.$modelValue;

        
        ngModel.$render = function(){
            // reached when the model changes from outside
            // console.log('render reached with value ' + ngModel.$modelValue);
            element[0].currentTime = ngModel.$modelValue;
            // console.log('video has a currentTime value of ' + element[0].currentTime);
        };

        scope.onTimeUpdate = function(){
            scope.$apply(function(){
                ngModel.$setViewValue(Math.round((element[0].currentTime) *10)/10);
                // console.log('currenttime has changed. New model value:  ' + ngModel.$viewValue);
            });
        };

        onVideoReady = function(){
            element[0].currentTime = ngModel.$modelValue;
        }

        element.bind('timeupdate', scope.onTimeUpdate);
        element.bind('canplaythrough', onVideoReady);

        scope.startVideoPlayback = function(){
            // console.log('videoplayback reached');
            element[0].play();
        };
        
        scope.pauseVideoPlayback = function(){
            element[0].pause();
        };

        scope.playVideoAt = function(startPosition){
            if (startPosition < 0) {
                startPosition = 0;
            }
            element[0].currentTime = startPosition;
            element[0].play();
        };

        scope.playAndSkipAt = function(startPosition){
            var newPosition = startPosition - skipBeforeInterval;
            if (newPosition < 0) { newPosition = 0 };
            element[0].currentTime = newPosition;
            element[0].play();
        }
    },
  };
}]);

app.filter('numberTimeFormat', function(){
    return function(inputNumber){
        console.log('inputnumber', inputNumber);
        if (!angular.isNumber(inputNumber)) { 
            return "00:00:00.0";
        };

        if (inputNumber < 0){
            return "00:00:00.0";
        };

        // maak van de getallen ints door ze te vermenigvuldigen met 10
        var myint = inputNumber * 10;
        // console.log('intnmber: ' + myint);
        // console.log('input:' + inputNumber);
        var hours = Math.floor(myint / (600 * 60));
        // console.log('hours: ' + hours);
        var minutes = Math.floor((myint - hours * 36000) / 600);
        // console.log('min: ' + minutes);
        var rest = Math.floor((myint - hours * 36000 - minutes * 600))/10;
        // console.log('rest: ' + rest);

        var hourstr = hours < 10 ? '0' + hours : '' + hours;
        var minstr = minutes < 10 ? '0' + minutes : '' + minutes;
        var reststr = rest === Math.floor(rest) ? rest + '.0' : rest;
        reststr = reststr < 10 ? '0' + reststr : reststr;
        var output = hourstr + ':' + minstr + ':' + reststr;
        // console.log('output: ' + output);

        return output
    }
});

app.controller('TranscriptionCtrl', ['$scope', '$sce', '$state', 'project', 'transcripts', 'modi', function($scope, $sce, $state, project, transcripts, modi){

    $scope.correctionFactor = 0.6;

    $scope.start = 0;
    $scope.comment = '';
    $scope.transcripts = transcripts.transcripts;
    $scope.modi = modi.modi;
    $scope.project = project;
    $scope.videofile = $sce.trustAsResourceUrl('images/' + project.videofile);

    if ($scope.modi.length > 0){
        $scope.modus = $scope.modi[0]._id;
    };

    $scope.saveTranscriptionSettings = function(){
        $state.go('project', {id: $scope.project._id}, {reload: true});
    };

    $scope.goHome = function(){
        $state.go('home', {}, {reload: true});
    };

    $scope.addTranscript = function(){
        // indien er geen comment is en de video gepauseerd is 
        // dan starten we de video opnieuw
        if ($scope.comment === '' | !$scope.comment){ 
            return; 
        }

        // we mogen niets aanmaken als er geen project aanhangt
        if (!$scope.project){
            return;
        }

        // we kunnen niets aanmaken als er geen modus aanhangt
        if (!$scope.modus){
            return;
        }

        var correctedStartPosition = $scope.start - $scope.correctionFactor;
        console.log('$scope.start ' , $scope.start);
        if (correctedStartPosition < 0){
            correctedStartPosition = 0;
        }
        transcripts.create( {
            start: correctedStartPosition, 
            comment:$scope.comment, 
            project: $scope.project._id,
            modus: $scope.modus,
        });
        $scope.comment = '';
        $scope.startVideoPlayback();
    };

    $scope.editTranscript = function(transcript){
        $state.go('edit', {projectid: transcript.project, transcriptid: transcript._id});
    };

    $scope.trashTranscript = function(transcript){
        transcripts.trash(transcript);
    };

    $scope.openNameFormForId = function(modusid){
        $scope.descriptionform = -1;
        $scope.nameform = modusid;
    };

    $scope.openDescriptionFormForId = function(modusid){
        $scope.nameform = -1;
        $scope.descriptionform = modusid;
    };

    $scope.submitNameChangeForId = function(modus){
        modi.update(modus);
        $scope.nameform = -1;
        $scope.descriptionform = -1;
    };

    $scope.submitDescriptionChangeForId = function(modus){
        modi.update(modus);
        $scope.nameform = -1;
        $scope.descriptionform = -1;
    };

    $scope.addNewModus = function(){
        var newModus = {};
        newModus.project = $scope.project._id;
        newModus.modusName = '[naam]';
        newModus.modusDescription = '[Description]';
        modi.create(newModus);
        $scope.nameform = -1;
        $scope.descriptionform = -1;
        // $scope.modi.push(savedModus);
    };

    $scope.removeModus = function(modus){
        modi.trash(modus);
        // de transcripts zijn ook aangepast;
        transcripts.getAll($scope.project._id);
        $scope.transcripts = transcripts.transcripts;
        $scope.nameform = -1;
        $scope.descriptionform = -1;
    }

}]);

app.controller('EditCtrl', ['$scope', '$state', 'transcripts', 'modi', 'transcript', function($scope, $state, transcripts, modi, transcript){

    $scope.transcript = transcript;
    $scope.modi = modi.modi;

    // bepaal de huidige geselecteerde modus en zet die als 
    // een parameter op de scope
    // zet ook de huidige comment
    for (var i=0; i<$scope.transcript.modi.length;i++){
        if ($scope.transcript.modi[i].comment.length > 0){
            $scope.modus = $scope.transcript.modi[i].modusId;
            $scope.comment = $scope.transcript.modi[i].comment;
        };  
    };


    $scope.updateTranscript = function(){
        //TODO: refactor: mijn controller zou niet hoeven te weten welke format hij moet gebruiken
        var updatedTranscript = {
            _id: $scope.transcript._id,
            start: $scope.transcript.start,
            project: $scope.transcript.project,
            modus: $scope.modus,
            comment: $scope.comment,
        }
        transcripts.update(updatedTranscript);
        $state.go('project', {id: $scope.transcript.project});
    };

    $scope.cancelUpdate = function(transcript){
        $state.go('project', {id: transcript.project});
    }

}]);

app.controller('ProjectsCtrl', ['$scope', 'projects', function($scope, projects){


    $scope.projects = projects.projects;
    $scope.addMode = false;

    $scope.addProject = function(){
        var project = {
            videofile: $scope.projectVideo,
            projectname: $scope.projectName,
        };
        projects.add(project);
    };

    $scope.updateProject = function(project){
        projects.update(project);
    };

    $scope.deleteProject = function(project){
        projects.trash(project);
    };

}]);