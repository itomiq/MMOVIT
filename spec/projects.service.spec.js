describe('Projects service ', function(){

    var httpmock, projects, md;

    beforeEach(module('MMOVIT', 'MMOVITdata'));

    beforeEach(inject(function($httpBackend, mockData) {

        md = mockData;

        var projects = [];
        projects.push(mockData.project);

        // Set up the mock http service responses
        httpmock = $httpBackend;
        httpmock.whenGET('/projects').respond([md.project]);
        httpmock.whenGET('/projects/123').respond(md.project);
        httpmock.whenPOST('/projects').respond(md.project);
    }));

    afterEach(function() {
        httpmock.verifyNoOutstandingExpectation();
        httpmock.verifyNoOutstandingRequest();
    });

    it('should get all the projects', inject(function (projects){
        httpmock.expectGET('/projects');
        responds = projects.getAll();
        httpmock.flush();
        // console.log(responds);
        expect(responds.$$state.value.status).toBe(200);
        expect(projects.projects.length).toBe(1);
        expect(projects.projects[0]).toEqual(md.project);
    }));

    it('should resolve a project', inject(function (projects){
        httpmock.expectGET('/projects/123');
        responds = projects.get(123);
        httpmock.flush();
        // console.log(responds);
        expect(responds.$$state.value).toEqual(md.project);
    }));

    it('should add a project to the backend and the local storage', inject(function (projects){
        httpmock.expectPOST('/projects');
        //TODO: maak het onderstaande meer generiek
        projects.add({videofile: 'someurl.mp4', projectname:'test'});
        httpmock.flush();
        expect(projects.projects.length).toBe(1);
    }));
})