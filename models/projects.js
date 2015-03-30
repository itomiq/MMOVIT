var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    videofile: String,
    projectname: String,
});

mongoose.model('Project', ProjectSchema);