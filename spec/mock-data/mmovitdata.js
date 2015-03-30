'use strict'
angular.module('MMOVITdata',[])
    .value('mockData',{
        project: {
            _id: 1,
            projectname: 'Consultatie barbara',
            videofile: 'barbara.mp4',
        },
        transcript : {
            _id: 123,
            start: 10.5,
            comment: 'Dit is een eerste test',
            project: 1,
            modus: 2,
        },
        transformedTranscript: {
            _id: 123,
            start: 10.5,
            project: 1,
            modi: [{
                    modusId:1,
                    sequenceNumber: 0,
                    comment: ''
                },
                {
                    modusId: 2,
                    sequenceNumber: 1,
                    comment:'Dit is een eerste test'
                }]
        },
        transcript1 : {
            start: 6,
            comment: 'Dit is een tweede test',
            project: 1,
        },
        modus1ForProject1: {
            _id: 1,
            sequenceNumber: 0,
            project: 1,
            modusName: 'Verbale communicatie',
            modusDescription: 'Alles wat gezegd wordt',
        },
        modus2ForProject1: {
            _id: 2,
            sequenceNumber: 1,
            project: 1,
            modusName: 'Non-verbale communicatie',
            modusDescription: 'Alles wat niet gezegd wordt',
        },
        unsavedModusForProject1: {
            project: 1,
            modusName: 'Nog niet bewaard',
        },
        savedModusForProject1:{
            _id: 3,
            sequenceNumber: 2,
            project: 1,
            modusName: 'Nog niet bewaard',
            modusDescription: '',
        },
        updatedModus3:{
            _id: 3,
            sequenceNumber: 2,
            project: 1,
            modusName: 'Verbale communicatie',
            modusDescription: 'We kijken naar alles wat er gezegd wordt',
        },
});