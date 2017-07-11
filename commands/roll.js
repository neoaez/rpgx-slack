

module.exports = (app) => {
  let slapp = app

  // Slash Command: ... 
  slapp.command('/roll', (msg) => {

    const dieCodeSymbol = 'd'

    // create a variable to hold the end result of our dice rolling
    var rollResult = null

    // we need to assume that any text send after the /roll command is the code used to tell our dice roller what to do.
    // we will parse this out and handle any errors.
    var diceCode = msg.body.text.toString()

    // [TO DO] strip out any spaces in the diceCode. This will make it easier to check for various options like modifiers.
  

    // check for the presence of 'd' or 'D' in the dice code.
    if (diceCode.toLowerCase().indexOf(dieCodeSymbol) != -1) {
      // [DEBUG] 
      console.info(`Found match of dieCodeSymbol (${dieCodeSymbol}) in: ${diceCode}`)

      //split the diceCode into its components: dieQuantity, dieFaces

    } else {
      console.error(`Could not find match of dieCodeSymbol (${dieCodeSymbol}) in: ${diceCode}`)  
    }


    // `respond` is used for actions or commands and uses the `response_url` provided by the
    // incoming request from Slack
    msg.respond(`I'll roll dice soon. Just wait.`)

  })

}
