var restify = require('restify');
var builder = require('botbuilder');
  
// Create chat bot
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);


//=========================================================
// Bots Dialogs
//=========================================================



bot.dialog('/', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, 'How old are you?');
    },
    function (session, results) {
        session.userData.age = results.response;
        if(session.userData.age < 18)
        {
            session.send('%s are you still in college. When i will be %d i will go to some college.',session.userData.name,session.userData.age);
        }
        else{
            session.send('%s, Being adult is not fun i still my college days.', session.userData.name);
        } 
        session.endDialog();
    }
]);

// Anytime the major version is incremented any existing conversations will be restarted.
    bot.use(builder.Middleware.dialogVersion({
        version: 1.0,
        resetCommand: /^reset/i
    }));
