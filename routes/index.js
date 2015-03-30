var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Transcript = mongoose.model('Transcript');
var Project = mongoose.model('Project');
var Modus = mongoose.model('Modus');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.param('transcript', function(req, res, next, id) {
    var query = Transcript.findById(id);

    query.exec(function(err, transcript){
        if (err) {return next(err);}
        if (!transcript) {return next(new Error('can\'t find transcript'));}

        req.transcript = transcript;
        return next();
    });
});

router.param('project', function(req, res, next, id) {
    var query = Project.findById(id);

    query.exec(function(err, project){
        if (err) {return next(err);}
        if (!project) {return next(new Error('can\'t find project'));}

        req.project = project;
        return next();
    });
});

router.get('/projects/:project/transcripts', function(req, res, next){

    // enkel die transcripts van het bijhorende project
    Transcript.find({project: req.project._id},function(err, transcripts){
        if (err){ return next(err); }
        res.json(transcripts);
    });
});

router.get('/projects/:project/transcripts/:transcript', function(req, res){
    res.json(req.transcript);
});


// om nieuwe transcripts te bewaren
router.post('/projects/:project/transcripts', function(req, res, next){
    var transcript = new Transcript(req.body);
    transcript.save(function(err, transcript){
        // indien error geef je het door aan de volgende
        if (err) { return next(err); }
        res.json(transcript);
    });
});

router.post('/projects/:project/transcripts/:transcript/trash', function(req, res, next){
    req.transcript.trash(function(err, transcript){
        if (err) {return next(err);}
        res.json(transcript);
    });
});

router.post('/projects/:project/transcripts/:transcript/edit', function(req, res, next){
    var newTranscript = req.body;
    var oldTranscript = req.transcript;
    var id = newTranscript._id;
    Transcript.findByIdAndUpdate(id, newTranscript, function(err, transcript){
        if (err) { return next(err); }
        res.json(oldTranscript);
    });
});

router.get('/projects', function(req, res, next){
    Project.find(function(err, projects){
        if (err) {return next(err); }
        res.json(projects);
    });
});

router.get('/projects/:project', function(req, res, next){
    res.json(req.project);
});

router.get('/projects/:project/trash', function(req, res, next){
    // verwijder alle transcripts van dit project
    Transcript.remove({project: req.project._id}, function(err, transcripts){
        if (err){return next(err)};
        // verwijder alle bijhorende modi
        Modus.remove({project: req.project._id}, function(err, modi){
            if (err) {return next(err)};
            // verwijder nu het project zelf
            Project.remove({_id: req.project._id}, function(err, project){
                if (err){return next(err)};
                // geef het project terug
                res.json(project);
            });
        });
    });
});

// to add or update a project
router.post('/projects', function(req, res, next){
    if (!req.body._id){
        var newProject = new Project(req.body);
        newProject.save(function(err, project){
            if (err) {return next(err);}
            res.json(project);
        });        
    } else {
        Project.findByIdAndUpdate(req.body._id,req.body,function(err, data){
            if (err) {return next(err)};
            res.json(data);
        })
    };
});


// getter for all the modi for a given project
router.get('/projects/:project/modi', function(req, res, next){
    Modus.find({project: req.project._id}, function(err, modi){
        if (err) {return next(err); }
        res.json(modi);
    })
});

// to store a new modus for a given project
router.post('/projects/:project/modi', function(req, res, next){
    if (!req.body._id){
        // het gaat om een nieuw object
        var newModus = new Modus(req.body);
        newModus.save(function(err, modus){
            if (err) {return next(err); };
            res.json(newModus);
        });
    } else {
        // het gaat hier om een bestaand object
        // we updaten de databank
        Modus.findByIdAndUpdate(req.body._id, req.body, function(err, oldmodus){
            if (err) { return next(err) }
            res.json(oldmodus);
        });
    }
});

// to remove a modus

router.post('/projects/:project/modi/trash', function(req, res, next){
    // verwijder alle transcripts voor deze modus
    Transcript.remove({modus: req.body._id}, function(err, data){
        if (err) {return next(err)};
        // verwijder vervolgens de modus zelf
        Modus.remove({_id: req.body._id}, function(err, modus){
            if (err){return next(err)};
            res.json(modus);
        })
    })
});


