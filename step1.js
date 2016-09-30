/**
 * Hello world from bot
 */
var restify = require('restify');
var builder = require('botbuilder');
  
// Create chat bot
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);


//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    session.send("Hello World");
});