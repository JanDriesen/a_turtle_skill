'use strict';

var Alexa = require('alexa-app');
var app = new Alexa.app('TurtleSkill-Breachhead');

// launch without intent
app.launch(function (req, res) {
    console.log("Launch Invoked");
    
    var prompt = "The cycle of life can be cruel";
    res.say(prompt);
    
    const token = 'https://s3-eu-west-1.amazonaws.com/jandriesen/turtle_song.mp3';
    const stream = {
        url: token,
        token: token,
        offsetinMilliseconds:5000
    };
    
    res.audioPlayerPlayStream('REPLACE_ALL', stream);
});

// User wants to pause the stream
app.intent('AMAZON.PauseIntent', {}, function (req, res) {
    console.log(`Pause Invoked!`);
    
    res.say("Pause");
    res.audioPlayerStop(); 
});

// User wants to resume the stream
app.intent('AMAZON.ResumeIntent', {}, function (req, res) {
    console.log(`Resume Invoked!`);
    
    if (req.data.context.AudioPlayer.offsetInMilliseconds > 0 && req.data.context.AudioPlayer.playerActivity === 'STOPPED') {
        var token = req.data.context.AudioPlayer.token;

        var url = token;
        var stream = {
            token: token,
            url: url, // hack: use token to remember the URL of the stream
            offsetInMilliseconds: req.data.context.AudioPlayer.offsetInMilliseconds
        };

        return res.audioPlayerPlayStream('REPLACE_ALL', stream);
    }
});

// User wants next item in audio queue or to resume the stream
app.intent('AMAZON.NextIntent', {}, function (req, res) {
    console.log(`Next Invoked!`);
    
    if (req.data.context.AudioPlayer.offsetInMilliseconds > 0 && req.data.context.AudioPlayer.playerActivity === 'STOPPED') {
        var token = req.data.context.AudioPlayer.token;

        var url = token;
        var stream = {
            token: token,
            url: url, // hack: use token to remember the URL of the stream
            offsetInMilliseconds: req.data.context.AudioPlayer.offsetInMilliseconds
        };

        return res.audioPlayerPlayStream('REPLACE_ALL', stream);
    }
});

//hack to support custom utterances in utterance expansion string
var utterancesMethod = app.utterances;
app.utterances = function () {
    return utterancesMethod().replace(/\{\-\|/g, '{');
};

// export handlers
module.exports = app;