describe('Modi service', function(){

    var httpmock, modi, md;

    beforeEach(module('MMOVIT', 'MMOVITdata'));

    beforeEach(inject(function($httpBackend, mockData) {

        md = mockData;

        // var modi = [];
        // modi.push(mockData.project);

        // Set up the mock http service responses
        httpmock = $httpBackend;
        httpmock.whenGET('/projects/1/modi').respond([md.modus1ForProject1, md.modus2ForProject1]);
        httpmock.whenPOST('/projects/1/modi', md.unsavedModusForProject1).respond(md.savedModusForProject1);
        httpmock.whenPOST('/projects/1/modi', md.updatedModus3).respond(md.savedModusForProject1);
        httpmock.whenPOST('/projects/1/modi/trash', md.savedModusForProject1).respond(md.savedModusForProject1);
    }));

    afterEach(function() {
        httpmock.verifyNoOutstandingExpectation();
        httpmock.verifyNoOutstandingRequest();
    });

    it('should get all the modi', inject(function (modi){
        httpmock.expectGET('/projects/1/modi');
        responds = modi.getAll(1);
        httpmock.flush();
        expect(responds.$$state.value.status).toBe(200);
        expect(modi.modi.length).toBe(2);
    }));

    it('should create a new modus in the backend and update', inject(function(modi){
        httpmock.expectPOST('/projects/1/modi', md.unsavedModusForProject1);
        modi.create(md.unsavedModusForProject1);
        httpmock.flush();
        expect(modi.modi.length).toBe(1);
        var myRespons = md.savedModusForProject1;
        myRespons.sequenceNumber = 0;
        expect(modi.modi[0]).toEqual(myRespons);
    }));

    it('should update an existing modus', inject(function(modi){
        modi.create(md.unsavedModusForProject1);
        httpmock.flush();
        httpmock.expectPOST('/projects/1/modi', md.updatedModus3);
        var responds = modi.update(md.updatedModus3);
        httpmock.flush();
        expect(modi.modi.length).toBe(1);
        expect(modi.modi[0]._id).toBe(3);
        // verwacht de oude waarde als antwoord van de backend
        expect(responds.$$state.value.data).toEqual(md.savedModusForProject1);
        expect(modi.modi[0].modusName).toEqual(md.updatedModus3.modusName);
        expect(modi.modi[0].modusDescription).toEqual(md.updatedModus3.modusDescription);
    }));

    it('should allow the removal of an existing modus', inject(function(modi){
        modi.create(md.unsavedModusForProject1);
        httpmock.flush();
        httpmock.expectPOST('/projects/1/modi/trash', md.savedModusForProject1);
        modi.trash(md.savedModusForProject1);
        httpmock.flush();
        expect(modi.modi.length).toBe(0);
    }));
})