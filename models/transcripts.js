var mongoose = require('mongoose');

var TranscriptSchema = new mongoose.Schema({
    start: {type: Number, default: 0},
    comment: String,
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    modus: {type: mongoose.Schema.Types.ObjectId, ref: 'Modus'}
});

TranscriptSchema.methods.trash = function(cb) {
    this.remove(cb);
}

mongoose.model('Transcript', TranscriptSchema);