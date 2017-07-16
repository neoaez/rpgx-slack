'use strict'

//var roller = require('../lib/node-roll-master/bin/roll')


/** [TO DO] create rollers for:
 * 
 * Cortex (multiple pools of die types; highlight best X results - usually 2)
 * Infinity (opposed roll under target # and closest to target # wins; critical if exactly target #)
 * Fate (special die type)
 * 
 */

 /** Example dice codes
  *  ==================
  * 
  * 3d6,2d8 ...........roll 2 pools of dice and return results
  * 8d10t>8s3..........roll 1 pool of dice and tell me if I get at least 3 dice showing an 8 or higher; return results
  * 7d6s2t>4!..........roll 1 pool of dice and tell me if I get at least 2 dice showing a 4 or higher; explode any dice that roll a 6; return results
  * 5d6b2..............roll 1 pool of dice and highlight the best 2 results
  * 4d6b3=.............roll 4 dice; keep the best 3 and total them
  */

module.exports = (app) => {
  let slapp = app.slapp

  //const fullDiceRegExp = /(\d*)([d](\d*)([\+|\-|\*|\/](\d*)))+/ig
  const diceRegExp = /((\d*)[d](\d*))+/i
  const bestOrWorstResultsRegExp = /([b|w](\d*))+/i
  const successRegExp = /([s](\d*))+/i
  const targetRegExp = /([>|<](\d*))+/i
  const modifierRegExp = /([\+|\-|\*|\/](\d*))+/ig
  const addModifierRegExp = /([\+](\d*))+/ig
  const subtractModifierRegExp = /([\-](\d*))+/ig
  const multiplyModifierRegExp = /([\*](\d*))+/ig
  const divideModifierRegExp = /([\/](\d*))+/ig

  const multiplePoolsSeparator = ','
  const explodeSymbol = '!'
  const sumResultsSymbol = '='
  const HighlightNoResults = 0
  const HighlightBestResults = 1
  const HighlightWorstResults = 2

  const diceRollMessageColor = '#ffb84d'

  // Slash Command: ... 
  slapp.command('/roll', (msg) => {


    var nameOfDiceRoller = msg.body.user_name


    //    /(\w*)+[\|]/i

    if (msg.body.text.indexOf('|') != -1) {
      var commandParameters = msg.body.text.split('|')
      nameOfDiceRoller = commandParameters[0]
    }


    var command = msg.body.text.toString()
    var results = []
    var rolls = []
    /*
    rolls = {
      {
        dice: '10d6',
        mods: ['+5'],
        successes: '2',
        target: '>4',
        results: [1,1,1,1,1,1,1,1,1,1],
        rolltotal: 10,
        modtotal: 15,
        verdict: 'success'
      },
      {

      }
    }

    */

    // Get what dice pools we are rolling
    if (command.indexOf(multiplePoolsSeparator)) {
      rolls = command.split(multiplePoolsSeparator)
    } else {
      rolls.push(command)
    }

    // [DEBUG]
    console.info(`[DEBUG] rolls: ${rolls}`)
    // [TO DO] add error handling. If there are no dice to roll then we need to give feedback to the user and exit

    //
    for (var i = 0; i < rolls.length; i++) {

      // [DEBUG]  
      console.log(`roll: ${rolls[i]}`)

      var diceArray = rolls[i].match(diceRegExp)
      var dice = "1d6"
      var quantityArray = null
      var quantity = 1
      var facesArray = null
      var faces = 6
      
      // [DEBUG]
      console.info(`[DEBUG] diceArray: ${diceArray}`)
      
      if (diceArray) {
        // [DEBUG]
        console.info(`[DEBUG] diceArray has value...`)
        
        quantityArray = diceArray[0].match(/(\d*)+[d]/i)
        if (quantityArray) { 
          // [DEBUG]
          console.info(`[DEBUG] quantityArray has value...`)
          quantity = quantityArray[0].match(/[(\d*)]+/)[0] 
        }
        facesArray = diceArray[0].match(/[d](\d*)+/i)
        if (facesArray) { 
          // [DEBUG]
          console.info(`[DEBUG] facesArray has value...`)
          faces = facesArray[0].match(/[(\d*)]+/)[0] 
        }
      }

      // See if we are using the Target number option
      var target = rolls[i].match(targetRegExp)
      if (target) { target = target[0].match(/[(\d*)]+/)[0] }

      // See if we are using the Successes required option
      var successesRequired = rolls[i].match(successRegExp)
      if (successesRequired) { successesRequired = successesRequired[0].match(/[(\d*)]+/)[0] }

      var modifiers = rolls[i].match(modifierRegExp)

      var resultsToHighlight = rolls[i].match(bestOrWorstResultsRegExp)
      var highlightType = HighlightNoResults
      if (resultsToHighlight) { 
        if (resultsToHighlight[0].match(/[b]/i)) {
          highlightType = HighlightBestResults
        } else if (resultsToHighlight[0].match(/[w]/i)) {
          highlightType = HighlightWorstResults
        }
      }

      var bTotalResults = false
      if (rolls[i].indexOf(sumResultsSymbol) != -1) { bTotalResults = true }

      results.push(diceRoll(quantity, faces, target, modifiers, successesRequired, bTotalResults))

      // [DEBUG]
      //console.info(`[DEBUG] results: ${results}`)
    
      // `respond` is used for actions or commands and uses the `response_url` provided by the
      // incoming request from Slack
      //msg.respond(`code: ${rolls[i]}`)
    }



    for (var k = 0; k < results.length; k++) {
      //msg.say(`${msg.body.user_name} rolled: ${results[k].quantity}d${results[k].faces} [${results[k].rolls}] (*${results[k].modifiedTotal}*)`)
    
        msg.say({
          response_type: 'in_channel',
          username: `RpgXDice   @${msg.body.user_name}`,
          icon_url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/10617-200.png',
          text: '',
          attachments: [{
            text: `${results[k].quantity}d${results[k].faces} [${results[k].rolls}] (*${results[k].modifiedTotal}*)`,
            title: `${nameOfDiceRoller} rolled:`,
            color: diceRollMessageColor,
            mrkdwn_in: ["text", "pretext"],
            //thumb_url: `${npcThumb}`
          }]
        })


      /** [TO DO]
       * use attachments and message buttons to show/hide roll details 
       * 
       * use icon to distringuish die rolls: https://d30y9cdsu7xlg0.cloudfront.net/png/10617-200.png
       */
      
    }

  })

  var diceRoll = function (quantity, faces, target, modifiers, successesRequired) {
    var poolResults = {
      quantity: quantity,
      faces: faces,
      modifiers: modifiers,
      modifier: 0,
      target: target,
      successesRequired: successesRequired,
      total: 0,
      modifiedTotal: 0,
      rolls: []
    }

    // [DEBUG]
    console.info(`[DEBUG] modifer list: ${modifiers}`)
    var modifier = 0
    if (modifiers) {
      for (var j = 0; j < modifiers.length; j++) {
        modifier += parseInt(modifiers[j])
        // [DEBUG]
        console.info(`[DEBUG] modifier: ${parseInt(modifiers[j])}`)
      }
      poolResults.modifier = modifier
    }

    // [DEBUG]
    console.info(`[DEBUG] modifier total: ${modifier}`)

    var rollResults = []
    var rollTotal = 0

    for (var i = 0; i < quantity; i++) {
      var roll = Math.floor(Math.random() * faces) + 1
      rollTotal += roll
      rollResults.push(roll)
    }

    poolResults.total = rollTotal;
    poolResults.modifiedTotal = rollTotal + modifier

    /** [TO DO] 
     * 
     * sum total; if required
     * get best or worst results; if required
     * 
    */

    poolResults.rolls = rollResults

    return poolResults
  }
  

}