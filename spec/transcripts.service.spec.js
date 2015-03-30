describe('Transcripts service', function(){

    var httpmock, transcript, transcripts, md, proj;
    var mockModiService;

    beforeEach(module('MMOVIT', 'MMOVITdata'));

    beforeEach(inject(function($httpBackend, mockData, modi) {

        md = mockData;
        transcript = md.transcript;

        this.proj = md.project;

        mockModiService = modi;
        mockModiService.modi = [
            md.modus1ForProject1,
            md.modus2ForProject1
        ];

        // Set up the mock http service responses
        httpmock = $httpBackend;
        httpmock.whenGET('/projects/' + this.proj._id + '/transcripts').respond([transcript]);
        httpmock.whenGET('/projects/' + this.proj._id + '/transcripts/' + transcript._id).respond(transcript);
        httpmock.whenPOST('/projects/' + this.proj._id + '/transcripts', md.transcript1).respond(md.transcript1);
        // httpmock.whenPOST('/projects/' + this.proj._id + '/transcripts/' + transcript._id + '/edit', newTranscript).respond(md.transcript1);
        httpmock.whenPOST('/projects/' + this.proj._id + '/transcripts/' + transcript._id + '/trash', transcript).respond(md.transcript);
    }));


    afterEach(function() {
        httpmock.verifyNoOutstandingExpectation();
        httpmock.verifyNoOutstandingRequest();
    });

    it('should get all the transcripts', inject(function (transcripts){
        httpmock.expectGET('/projects/' + this.proj._id + '/transcripts');
        responds = transcripts.getAll(this.proj._id);
        httpmock.flush();
        expect(responds.$$state.value.status).toBe(200);
        expect(transcripts.transcripts.length).toBe(1);
        expect(transcripts.transcripts[0]).toEqual(md.transformedTranscript);
    }));

    it('should get a transcript and transform it.', inject(function (transcripts){
        httpmock.expectGET('/projects/' + this.proj._id + '/transcripts/' + transcript._id);
        responds = transcripts.get(this.proj._id, transcript._id);
        httpmock.flush();
        expect(responds.$$state.value).toEqual(md.transformedTranscript);
    }));

    it('should call the backend correctly on create', inject(function (transcripts){
        // test om te zien of de backend aangeroepen wordt
        expect(transcripts.transcripts.length).toBe(0);
        httpmock.expectPOST('/projects/' + md.transcript1.project + '/transcripts', md.transcript1);
        transcripts.create(md.transcript1);
        httpmock.flush();
        expect(transcripts.transcripts.length).toBe(1);
    }));    

    it('should call the backend correctly on trash', inject(function (transcripts){
        transcripts.transcripts.push(transcript);
        // test om te zien of de backend aangeroepen wordt
        httpmock.expectPOST('/projects/' + transcript.project + '/transcripts/' + transcript._id +'/trash', transcript);
        transcripts.trash(transcript);
        httpmock.flush();
        expect(transcripts.transcripts.length).toBe(0);
    }));

    it('should call the backend correctly on update and transform the result', inject(function (transcripts){
        
        transcripts.transcripts.push(transcript);

        // mock wat data
        var newTranscript = angular.copy(transcript);
        newTranscript.comment = 'aangepast';

        var newTransformedTranscript = angular.copy(md.transformedTranscript);
        newTransformedTranscript.modi[1].comment = 'aangepast';

        // de backend geeft het oude object bij update terug
        httpmock.whenPOST('/projects/' + this.proj._id + '/transcripts/' + newTranscript._id + '/edit', newTranscript).respond(md.transcript);

        // test om te zien of de backend aangeroepen wordt
        httpmock.expectPOST('/projects/' + newTranscript.project + '/transcripts/' + newTranscript._id + '/edit', newTranscript);
        transcripts.update(newTranscript);
        httpmock.flush();
        // er mag geen object weg of bij gekomen zijn
        expect(transcripts.transcripts.length).toBe(1);
        // het nieuwe object moet getransformeerd zijn
        expect(transcripts.transcripts[0]).toEqual(newTransformedTranscript);
    }));
})