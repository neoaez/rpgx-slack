'use strict'

module.exports = (app) => {
  let slapp = app.slapp

  // Slash Command: ... 
  slapp.command('/roll', (msg) => {

    const dieTypeSymbol = 'd'
    const addModifierSymbol = '+'
    const subtractModifierSymbol = '-'
    const multiplyModifierSymbol = '*'
    const divideModifierSymbol = '/'
    const successesSymbol = 's'
    const targetNumberSymbol = 't'
    const diceCodeSeparator = '|'


    // create a variable to hold the end result of our dice rolling
    var rollResult = null
    var dieQuantity = 1
    var dieFaces = 6
    var modifier = 0
    var modifierType = null
    var targetNumber = -1
    var successesRequired = -1
    

    // we need to assume that any text send after the /roll command is the code used to tell our dice roller what to do.
    // we will parse this out and handle any errors.
    // first we try and standardize the code converting it to a string and making everything lowercase
    var diceCode = msg.body.text.toString().toLowerCase()

    // strip out any spaces in the diceCode. This will make it easier to check for various options like modifiers.
    diceCode =  diceCode.replace(/ /g,'')

    // check for the presence of 'd' in the dice code. Without this we fail. Everything else is pretty much optional.
    var dieTypeIndex = diceCode.indexOf(dieTypeSymbol)
    if (dieTypeIndex > -1) {
      // [DEBUG] 
      console.info(`Found match of dieCodeSymbol (${dieTypeSymbol}) in: ${diceCode}`)
      diceCode =  diceCode.replace(dieTypeSymbol, `${diceCodeSeparator}${dieTypeSymbol}`)

      // check for options
      // *** successes 
      var successesIndex = diceCode.indexOf(successesSymbol)
      if (successesIndex > -1 ) {
        diceCode =  diceCode.replace(successSymbol, `${diceCodeSeparator}${successSymbol}`)        
      }

      // *** target number
      var targetIndex = diceCode.indexOf(targetNumberSymbol)
      if (targetIndex > -1 ) {
        diceCode =  diceCode.replace(targetNumberSymbol, `${diceCodeSeparator}${targetNumberSymbol}`)        
      }
     
      // *** modifiers
      // only one modifier can be used
      // ****** add modifier
      var modifierIndex = diceCode.indexOf(addModifierSymbol)
      if (modifierIndex > -1) {
        diceCode =  diceCode.replace(addModifierSymbol, `${diceCodeSeparator}${addModifierSymbol}`)        
      } else {
      // ****** subtract modifier
        modifierIndex = diceCode.indexOf(subtractModifierSymbol)
        if (modifierIndex > -1) {
          diceCode =  diceCode.replace(subtractModifierSymbol, `${diceCodeSeparator}${subtractModifierSymbol}`)        
        } else {
      // ****** multiply modifier
          modifierIndex = diceCode.indexOf(multiplyModifierSymbol)
          if (modifierIndex > -1) {
            diceCode =  diceCode.replace(multiplyModifierSymbol, `${diceCodeSeparator}${multiplyModifierSymbol}`)        
          } else {
      // ****** divide modifier           
            modifierIndex = diceCode.indexOf(divideModifierSymbol)
            if (modifierIndex > -1) {
              diceCode =  diceCode.replace(multiplyModifierSymbol, `${diceCodeSeparator}${multiplyModifierSymbol}`)        
            }
          }
        }
      }
      // create tokens by splitting up the new dice code with our separators in place
      diceCodeTokens = diceCode.split(diceCodeSeparator)
      
      for (counter = 0; counter < diceCodeTokens.length; counter++) {
        if (diceCodeTokens[counter].indexOf())
      }
    // no die type symbol found  
    } else {
      console.error(`Could not find match of dieTypeSymbol (${dieTypeSymbol}) in: ${diceCode}`)  
    }







    // `respond` is used for actions or commands and uses the `response_url` provided by the
    // incoming request from Slack
    msg.respond(`I'll roll dice soon. Just wait.`)

  })

}
