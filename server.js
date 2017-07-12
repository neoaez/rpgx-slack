'use strict'


const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

// Persist - for data storage
const DataStore = require('beepboop-persist')()


// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000


var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})

// attach Slapp to express server
var server = slapp.attachToExpress(express())

// define app variable that will pass around core objects
var app = {
  slapp,
  server,
  dataStore: DataStore //({ provider: config.persist_provider })
}

var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
\`hi\` - to demonstrate a conversation that tracks state.
\`thanks\` - to demonstrate a simple response.
\`<type-any-other-text>\` - to demonstrate a random emoticon response, some of the time :wink:.
\`attachment\` - to see a Slack attachment message.
`


//*********************************************
// Setup different handlers for messages
//*********************************************
require('./events/help.js')(app, HELP_TEXT)
require('./events/hello.js')(app)
require('./events/thanks.js')(app)
require('./events/attachment.js')(app)
require('./commands/roll.js')(app)

// Catch-all for any other responses not handled above
slapp.message('.*', ['direct_mention', 'direct_message'], (msg) => {
  // respond only 40% of the time
  if (Math.random() < 0.4) {
    msg.say([':wave:', ':pray:', ':raised_hands:'])
  }
})

// server was here =(


// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
