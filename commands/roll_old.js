

module.exports = (app) => {
  let slapp = app.slapp

  // Slash Command: ... 
  slapp.command('/roll', (msg) => {

    const dieCodeSymbol = 'd'
    const addModifierSymbol = "+"
    const subtractModifierSymbol = "-"
    const multiplyModifierSymbol = "*"
    const divideModifierSymbol = "/"
    

    // create a variable to hold the end result of our dice rolling
    var rollResult = null
    var dieQuantity = 1
    var dieFaces = 6


    // we need to assume that any text send after the /roll command is the code used to tell our dice roller what to do.
    // we will parse this out and handle any errors.
    var diceCode = msg.body.text.toString()

    // strip out any spaces in the diceCode. This will make it easier to check for various options like modifiers.
    diceCode =  diceCode.replace(/ /g,'')

    // check for the presence of 'd' or 'D' in the dice code.
    diceCodeIndex = diceCode.toLowerCase().indexOf(dieCodeSymbol)
    if (diceCodeIndex != -1) {
      // [DEBUG] 
      console.info(`Found match of dieCodeSymbol (${dieCodeSymbol}) in: ${diceCode}`)

      //split the diceCode into its components: dieQuantity, dieFaces
      diceCodeTokens = diceCode.toLowerCase().split(dieCodeSymbol)

      // if the index is 0 then a # of dice wasn't specified. In that case we'll assume 1 die.
      if (diceCodeIndex > 0) {
        dieQuantity = diceCodeTokens[0]
      }

      // before we can assume the last token is the # of faces on a die, we have to see if any modifiers were applied using +, -, /, *
      var addModifierIndex = diceCodeTokens[1].indexOf(addModifierSymbol)
      var subtractModifierIndex = diceCodeTokens[1].indexOf(subtractModifierSymbol)
      var multiplyModifierIndex = diceCodeTokens[1].indexOf(multiplyModifierSymbol)
      var divideModifierIndex = diceCodeTokens[1].indexOf(divideModifierSymbol) 


      var modifierTokens = null

      if (addModifierIndex > -1) {
        //split the diceCode into its components: dieQuantity, dieFaces
        modiferTokens = diceCodeTokens[1].split(addModifierSymbol)
        
      }


      
      dieFaces = diceCodeTokens[1]

    } else {
      console.error(`Could not find match of dieCodeSymbol (${dieCodeSymbol}) in: ${diceCode}`)  
    }


    // `respond` is used for actions or commands and uses the `response_url` provided by the
    // incoming request from Slack
    msg.respond(`I'll roll dice soon. Just wait.`)

  })

}
