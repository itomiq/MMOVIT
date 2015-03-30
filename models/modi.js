var mongoose = require('mongoose');

var ModusSchema = new mongoose.Schema({
    modusName: String,
    modusDescription: String,
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
});

mongoose.model('Modus', ModusSchema);