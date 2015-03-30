describe('TranscriptionCtrl', function() {

    var ctrl, scope, service, projectService, md;

    beforeEach(module('MMOVIT','MMOVITdata'));

    beforeEach(inject(function($controller, $rootScope, transcripts, projects, mockData) {

        md = mockData;
        scope = $rootScope.$new();
        service = transcripts;
        projectService = projects;

        projectService.projects.push(md.project);
        //Create the controller with the new scope
        ctrl = $controller('TranscriptionCtrl', {$scope: scope, transcripts: service, project: md.project});
        // mock the videoplayback function
        scope.startVideoPlayback = function(){
            return;
        }
        scope.correctionFactor = 0.6;
    }));

    it('should not update without a comment', function() {
        spyOn(service, 'create');
        
        // test without a comment in the scope
        scope.addTranscript();
        expect(service.create).not.toHaveBeenCalled();

        // test with an empty string as comment
        scope.comment = '';
        scope.addTranscript();
        expect(service.create).not.toHaveBeenCalled();

    });

    it('should not update without a modus', function() {
        spyOn(service, 'create');
        scope.comment = 'Dit is een test';
        scope.addTranscript();
        expect(service.create).not.toHaveBeenCalled();
    });

    //TODO: vindt een betere test voor het geval er geen geldig project gebruikt wordt bij de argumenten
    // it('should not update without a valid project', function() {

    //     spyOn(service, 'create');
    //     scope.comment = md.transcript.comment;

    //     // er is geen project in de scope,
    //     // dus het zou niet mogen updaten nu
    //     scope.addTranscript();
    //     expect(service.create).not.toHaveBeenCalled();

    //     // ook als het project niet bestaat (ongeldige id)
    //     // zou er niet mogen toegevoegd worden
    //     scope.project = 'blabla';
    //     scope.addTranscript();
    //     expect(service.create).not.toHaveBeenCalled();
    // });

    it('should add a transcript and start video', function() {
        // console.log('size of projects', projectService.projects.length);
        spyOn(service, 'create');
        spyOn(scope, 'startVideoPlayback');
        scope.comment = md.transcript.comment;
        scope.start = md.transcript.start;
        scope.modus = md.transcript.modus;
        // scope.project = md.transcript.project;
        scope.addTranscript();
        expect(service.create).toHaveBeenCalledWith({start: md.transcript.start - scope.correctionFactor, comment: md.transcript.comment, project: md.project._id, modus: md.transcript.modus});
        expect(scope.startVideoPlayback).toHaveBeenCalled();
    });


    it('should have a working thrash method', function(){
        spyOn(service, 'trash');
        scope.trashTranscript(md.transcript);
        expect(service.trash).toHaveBeenCalledWith(md.transcript);
    }); 

    //TODO: update method ook nog toevoegen

});