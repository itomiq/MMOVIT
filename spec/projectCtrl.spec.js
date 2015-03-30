describe('ProjectCtrl', function() {

    var ctrl, scope, service, project, md;

    beforeEach(module('MMOVIT', 'MMOVITdata'));

    beforeEach(inject(function($controller, $rootScope, projects, mockData) {

        md = mockData;
        project = md.project;

        scope = $rootScope.$new();
        scope.projectVideo = md.project.videofile;
        scope.projectName = md.project.projectname;
        service = projects;

        //Create the controller with the new scope
        ctrl = $controller('ProjectsCtrl', {$scope: scope, projects: service});
    }));

    it('should have a working addProject method', function() {
        spyOn(service, 'add');
        scope.addProject();
        expect(service.add).toHaveBeenCalledWith({videofile: scope.projectVideo, projectname:scope.projectName});
    });
});