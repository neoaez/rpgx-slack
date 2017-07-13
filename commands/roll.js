'use strict'

//var roller = require('../lib/node-roll-master/bin/roll')


module.exports = (app) => {
  let slapp = app.slapp

  // Slash Command: ... 
  slapp.command('/roll', (msg) => {

    var diceCode = msg.body.text.toString()
    //var diceRoll = roller.roll(diceCode)


    // `respond` is used for actions or commands and uses the `response_url` provided by the
    // incoming request from Slack
    msg.respond(`code: ${diceCode}`)

  })

}
