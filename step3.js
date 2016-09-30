var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var connector = new builder.ChatConnector({
    appId: '5009c77c-17c3-4a03-99c1-7d3261c24afb',
    appPassword: 'mY1yFsZ1eWgQx18ju162aKP'
});

var bot = new builder.UniversalBot(connector);
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});
server.get('/home', function(req, res) {
        res.send("server is running test by rest api");
    });
    
server.post('/api/messages', connector.listen());

bot.dialog('/', [
    function(session) {
        session.send('Cards demo');
        session.beginDialog('/menu');

    }
]);

bot.dialog('/menu', [
    function(session) {
        builder.Prompts.choice(session, 'Which card you want to see', "Hero|Thumbnail|Receipt|quit");
    },
    function(session, results) {
        if (results.response && results.response.entity != 'quit') {
            // Launch demo dialog

            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.send("good bye");
            session.endDialog();
        }
    },
    function(session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, {
    matches: /^menu|show menu/i
});

bot.dialog('/Hero', [
    function(session) {

        
            var card = new builder.HeroCard(session)
            .title("Hero Card")
            .subtitle("Hero card subtitle")
            .text("Life runs in code!")
            .images([
                builder.CardImage.create(session, "http://www.w3schools.com/css/trolltunga.jpg")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.endDialog();
    }
]);

bot.dialog('/Thumbnail', [
    function(session) {
        var msg = new builder.Message(session)
            .attachments([
                new builder.ThumbnailCard(session)
                .title("Thumbnail Card Title")            
                .subtitle("Thumbnail subtitle")
                .text("Sample Text")
                .images([
                    builder.CardImage.create(session, "http://www.w3schools.com/css/trolltunga.jpg")
                ])
            ]);
        session.send(msg);

        session.endDialog();
    }
]);

bot.dialog('/Receipt', [
    function (session) {
        session.send("You can send a receipts for purchased good with both images and without...");
        
        // Send a receipt with images
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Addidas shoes")
                    .items([
                        builder.ReceiptItem.create(session, "Rs. 2500.00", "Cool shoes").image(builder.CardImage.create(session, "https://s-media-cache-ak0.pinimg.com/564x/56/f0/1b/56f01b9ecd9ba2c47783067d9efbb019.jpg"))
                    ])
                    .facts([
                        builder.Fact.create(session, "1234567898", "Order Number"),
                        builder.Fact.create(session, "VISA 4076", "Payment Method"),
                        builder.Fact.create(session, "Urgent", "Delivery Method")
                    ])
                    .tax("10%")
                    .total("Rs. 2750")
            ]);
        session.send(msg);

        // Send a receipt without images
        msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("SR Medicals")
                    .items([
                        builder.ReceiptItem.create(session, "Rs. 22.00", "Brufin"),
                        builder.ReceiptItem.create(session, "Rs. 22.00", "Oninon")
                    ])
                    .facts([
                        builder.Fact.create(session, "1234567898", "Order Number"),
                        builder.Fact.create(session, "Cash On Delivery", "Payment Method"),
                        builder.Fact.create(session, "4pm - 8pm", "Delivery Time")
                    ])
                    .tax("Rs. 10")
                    .total("Rs. 54")
            ]);
        session.endDialog(msg);
    }
]);

// Anytime the major version is incremented any existing conversations will be restarted.
    bot.use(builder.Middleware.dialogVersion({
        version: 1.0,
        resetCommand: /^reset/i
    }));
