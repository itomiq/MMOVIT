describe('EditCtrl', function() {

    var ctrl, scope, service, md;

    beforeEach(module('MMOVIT','MMOVITdata'));

    beforeEach(inject(function($controller, $rootScope, transcripts, modi, mockData) {
        scope = $rootScope.$new();

        md = mockData;
        service = transcripts;
        //Create the controller with the new scope
        ctrl = $controller('EditCtrl', {$scope: scope, transcripts: service, transcript: md.transformedTranscript});
    }));

    it('should have a working update method', function() {
        spyOn(service, 'update');
        scope.updateTranscript(md.transcript);
        expect(service.update).toHaveBeenCalledWith(md.transcript);
    });

    it('should have a working cancelUpdate method', function() {
        scope.cancelUpdate(md.transcript);
    });
});