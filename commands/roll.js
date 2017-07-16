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

  //const fullDiceRegExp = /(\d*)([d](\d*)([+|-|*|/](\d*)))+/ig
  const diceRegExp = /((\d*)[d](\d*))+/i
  const bestOrWorstResultsRegExp = /([b|w](\d*))+/i
  const successRegExp = /([s](\d*))+/i
  const targetRegExp = /([>|<](\d*))+/i
  const modifierRegExp = /([+|-|*|/](\d*))+/i
  const addModifierRegExp = /([+](\d*))+/ig
  const subtractModifierRegExp = /([-](\d*))+/ig
  const multiplyModifierRegExp = /([*](\d*))+/ig
  const divideModifierRegExp = /([/](\d*))+/ig

  const multiplePoolsSeparator = ','
  const explodeSymbol = '!'
  const sumResultsSymbol = '='
  const HighlightNoResults = 0
  const HighlightBestResults = 1
  const HighlightWorstResults = 2

  // Slash Command: ... 
  slapp.command('/roll', (msg) => {

    var command = msg.body.text.toString()
    var results = []
    var rolls = null
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
      rolls  = command.split(multiplePoolsSeparator)
    } else {
      rolls = command
    }
    // [TO DO] add error handling. If there are no dice to roll then we need to give feedback to the user and exit

    //
    for (var i = 0; i < rolls.length; i++) {

      // [DEBUG]  
      console.log(`roll: ${rolls[i]}`)

      var diceArray = command.match(diceRegExp)
      var dice = "1d6"
      var quantityArray = null
      var quantity = 1
      var facesArray = null
      var faces = 6
      if (diceArray) {
        quantityArray = diceArray[0].match(/(\d*)+[d]/i)
        if (quantityArray) { quantity = quantityArray[0].match(/[(\d*)]+/)[0] }
        facesArray = diceArray[0].match(/[d](\d*)+/i)
        if (facesArray) { faces = facesArray[0].match(/[(\d*)]+/)[0] }
      }

      // See if we are using the Target number option
      var target = command.match(targetRegExp)
      if (target) { target = target[0].match(/[(\d*)]+/)[0] }

      // See if we are using the Successes required option
      var successesRequired = command.match(successRegExp)
      if (successesRequired) { successesRequired = successesRequired[0].match(/[(\d*)]+/)[0] }

      var modifiers = command.match(modifierRegExp)

      var resultsToHighlight = command.match(bestOrWorstResultsRegExp)
      var highlightType = HighlightNoResults
      if (resultsToHighlight) { 
        if (resultsToHighlight[0].match(/[b]/i)) {
          highlightType = HighlightBestResults
        } else if (resultsToHighlight[0].match(/[w]/i)) {
          highlightType = HighlightWorstResults
        }
      }

      var bTotalResults = false
      if (command.indexOf(sumResultsSymbol) != -1) { bTotalResults = true }

      results.push(diceRoll(quantity, faces, target, modifiers, successesRequired, bTotalResults))

      // [DEBUG]
      console.info(`[DEBUG] results: ${results}`)
    }


    // `respond` is used for actions or commands and uses the `response_url` provided by the
    // incoming request from Slack
    msg.respond(`code: ${command}`)

    msg.respond(`rolled: [${results[0].rolls}] (*${results[0].modifiedTotal}*)`)

  })

  var diceRoll = function (quantity, faces, target, modifiers, successesRequired) {
    var poolResults = {
      quantity: quantity,
      faces: faces,
      modifiers: modifiers,
      target: target,
      successesRequired: successesRequired,
      total: 0,
      modifiedTotal: 0,
      rolls: []
    }

    var modifier = 0
    if (modifiers) {
      for (var j = 0; j < modifiers.length; j++) {
        modifier += parseInt(modifiers[j])
        // [DEBUG]
        console.info(`[DEBUG] modifier: ${parseInt(modifiers[j])}`)      }
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