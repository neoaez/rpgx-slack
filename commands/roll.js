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
  let kv = app.dataStore

  //const fullDiceRegExp = /(\d*)([d](\d*)([\+|\-|\*|\/](\d*)))+/ig
  const diceRegExp = /(\d{1,}d)(\d{1,}|f)/i            // /((\d*)[d](\d*))+/i
  const fateDiceRegExp = /(\d{1,}df)/i
  const bestOrWorstResultsRegExp = /([bw](\d{1,}))/i
  const successRegExp = /(s\d{1,})/i
  const targetRegExp = /(t[><](\d{1,}))/i
  const modifierRegExp = /([\+\-\*\/]\d{1,})/ig
  const addModifierRegExp = /(\+\d{1,})/ig
  const subtractModifierRegExp = /(\-\d{1,})/ig
  const multiplyModifierRegExp = /(\*\d{1,})/ig
  const divideModifierRegExp = /(\/\d{1,})/ig

  const multiplePoolsSeparator = ','
  const explodeSymbol = '!'
  const sumResultsSymbol = '='
  const HighlightNoResults = 0
  const HighlightBestResults = 1
  const HighlightWorstResults = 2
  const contextSymbol = ':'

  const fateDiceSymbol = 'f'

  const MessageContextUser = 0
  const MessageContextCharacter = 1
 
  const diceRollIcon = 'https://d30y9cdsu7xlg0.cloudfront.net/png/10617-200.png'
  const diceRollMessageColor = '#ffb84d'
  const diceRollUser = 'RpgXDice'

  // Slash Command: ... 
  slapp.command('/roll', (msg) => {

    var messageContext = MessageContextUser
    var commandParameters = null
    var command = null

    var results = []
    var rolls = []

    var username = diceRollUser
    var diceRollerName = msg.body.user_name
    var diceRollerThumb = diceRollIcon
    var diceRollerColor = diceRollMessageColor

    //    /(\w*)+[\|]/i

// =============================================================
    // ====  Get message context 
    if (msg.body.text.indexOf(contextSymbol) != -1) {
      commandParameters = msg.body.text.split(contextSymbol)
      username = commandParameters[0]
      diceRollerName = commandParameters[0]
      command = commandParameters[1]
      messageContext = MessageContextCharacter
    } else {
      command = msg.body.text
    }



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
      var quantity = 0
      var facesArray = null
      var faces = 0
      
      // [DEBUG]
      console.info(`[DEBUG] diceArray: ${diceArray}`)
      
      if (diceArray) {
        // [DEBUG]
        console.info(`[DEBUG] diceArray has value...`)
        
        quantityArray = diceArray[0].match(/^(\d{1,}d)/i)
        if (quantityArray) { 
          // [DEBUG]
          console.info(`[DEBUG] quantityArray has value...`)
          quantity = quantityArray[0].match(/^(\d{1,})/)[0] 
        }
        facesArray = diceArray[0].match(/d(\d{1,}|f)/i)
        if (facesArray) { 
          // [DEBUG]
          console.info(`[DEBUG] facesArray has value...`)
          faces = facesArray[0].match(/(\d{1,}|f)/i)[0] 
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
        if (resultsToHighlight[0].match(/(b)/i)) {
          highlightType = HighlightBestResults
        } else if (resultsToHighlight[0].match(/(w)/i)) {
          highlightType = HighlightWorstResults
        }
      }

      var bTotalResults = false
      if (rolls[i].indexOf(sumResultsSymbol) != -1) { bTotalResults = true }

      if (quantity > 0 && (faces > 0 || faces.toLowerCase() == fateDiceSymbol)) {
        results.push(diceRoll(quantity, faces, target, modifiers, successesRequired, bTotalResults))
      }
    }



    // [DEBUG]
      console.info(`[DEBUG] message context: ${messageContext}`)


    if(messageContext == MessageContextCharacter) {

      // [DEBUG]
      console.info(`[DEBUG] message context is CHARACTER`)

      // retrieve npc data if it exists
      kv.get(`${msg.body.user_id}::NPC::${diceRollerName}`, function (err, val) {

        if (!err) {
          if (val) {
            diceRollerThumb = val.thumb
            diceRollerColor = val.color

            // [DEBUG]
            console.info(`thumb: ${val.thumb} | color: ${val.color}`)

            for (var k = 0; k < results.length; k++) {
              //msg.say(`${msg.body.user_name} rolled: ${results[k].quantity}d${results[k].faces} [${results[k].rolls}] (*${results[k].modifiedTotal}*)`)
            
              // [DEBUG]
              console.info(`diceRollerThumb: ${diceRollerThumb} | diceRollerColor: ${diceRollerColor}`)

              msg.say({
                response_type: 'in_channel',
                username: `${username}   (@${msg.body.user_name})`,
                icon_url: `${diceRollerThumb}`,
                text: '',
                attachments: [{
                text: 
                  `[${results[k].rolls}] (*${results[k].modifiedTotal}*)\n\n-----------------\n\n_Dice:_ ${results[k].quantity}d${results[k].faces}\n_Modifiers:_ ${results[k].modifiers} (*${results[k].modifier}*)\n_Roll(s):_ [${results[k].rolls}]\n_Total:_ ${results[k].total} (*${results[k].modifiedTotal}*)`,
                  color: `${diceRollerColor}`,
                  mrkdwn_in: ["text", "pretext"],
                  thumb_url: `${diceRollIcon}`
                }]
              })              
            }
          }  else {
            console.error(`[ERROR] no value for [${msg.body.user_id}::NPC::${diceRollerName}]`)
          }
        } else {
            // [TO DO] handle error
            console.error(`[ERROR] issue retrieving data for [${msg.body.user_id}::NPC::${diceRollerName}]`)
        }       
      })
    } else { 
      // [DEBUG]
      console.info(`[DEBUG] message context is USER`)

      for (var k = 0; k < results.length; k++) {
        //msg.say(`${msg.body.user_name} rolled: ${results[k].quantity}d${results[k].faces} [${results[k].rolls}] (*${results[k].modifiedTotal}*)`)
      
        // [DEBUG]
        console.info(`diceRollerThumb: ${diceRollerThumb} | diceRollerColor: ${diceRollerColor}`)

        msg.say({
          response_type: 'in_channel',
          username: `${username}   (@${msg.body.user_name})`,
          icon_url: `${diceRollerThumb}`,
          text: '',
          attachments: [{
            text: 
                  `[${results[k].rolls}] (*${results[k].modifiedTotal}*)\n\n-----------------\n\n_Dice:_ ${results[k].quantity}d${results[k].faces}\n_Modifiers:_ ${results[k].modifiers} (*${results[k].modifier}*)\n_Roll(s):_ [${results[k].rolls}]\n_Total:_ ${results[k].total} (*${results[k].modifiedTotal}*)`,
                  color: `${diceRollerColor}`,
                  mrkdwn_in: ["text", "pretext"],
                  thumb_url: `${diceRollIcon}`,
            title: `${diceRollerName} rolled:`,
            color: `${diceRollerColor}`,
            mrkdwn_in: ["text", "pretext"],
            thumb_url: `${diceRollIcon}`
          }]          
        })
      }
    }
  })



  /**
   * ==========================================================================
   * diceRoll 
   * ==========================================================================
   * @param {*} quantity 
   * @param {*} faces 
   * @param {*} target 
   * @param {*} modifiers 
   * @param {*} successesRequired 
   */

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
    var floor = 1

    // fate dice
    if (faces.toLowerCase() == fateDiceSymbol) { 
      faces = 3 
      floor = -1
    }

    for (var i = 0; i < quantity; i++) {
      var roll = Math.floor(Math.random() * faces) + floor
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


//=============================================================================
//=============================================================================

  slapp.action('rollDetails_callback', 'rollDetails', 'SHOW_DETAILS', (msg, val) => {
    console.info(`[DEBUG] SHOW_DETAILS action caught...`)
    
    msg.respond({
      replace_original: true,
      response_type: 'in_channel',
      username: msg.body.original_message.username,
      icon_url: msg.body.original_message.icon_url,
      text: msg.body.original_message.text,
      attachments: [{
        text: msg.body.original_message.attachments[0].text,
        //title: `${diceRollerName} rolled:`,
        color: msg.body.original_message.attachments[0].color,
        mrkdwn_in: ["text", "pretext"],
        thumb_url: `${diceRollIcon}`,

        callback_id: 'rollDetails_callback',
        actions: [
            {
                name: 'rollDetails',
                text: 'Summary',
                type: 'button',
                value: 'SHOW_SUMMARY'
            }
        ]
      }]
    })

  })


  slapp.action('rollDetails_callback', 'rollDetails', 'SHOW_SUMMARY', (msg, val) => {
    console.info(`[DEBUG] SHOW_SUMMARY action caught...`)
    
    msg.respond({
      replace_original: true,      
      response_type: 'in_channel',
      username: msg.body.original_message.username,
      icon_url: msg.body.original_message.icon_url,
      text: msg.body.original_message.text,
      attachments: [{
        text: msg.body.original_message.attachments[0].text,
        //title: `${diceRollerName} rolled:`,
        color: msg.body.original_message.attachments[0].color,
        mrkdwn_in: ["text", "pretext"],
        thumb_url: `${diceRollIcon}`,

        callback_id: 'rollDetails_callback',
        actions: [
            {
                name: 'rollDetails',
                text: 'Details',
                type: 'button',
                value: 'SHOW_DETAILS'
            }
        ]

      }]
    })

  })  
}