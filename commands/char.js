
var request = require('request')

module.exports = (app, text) => {
  let slapp = app.slapp
  let helpText = text
  let kv = app.dataStore

  // Slash Command: ... 
  slapp.command('/char', (msg) => {

    var userID = msg.body.user_id
    console.info(`user: ${userID}`)
    /** [TO DO] restrict access to this command to the channel owner and those authorized
     * 
     * will need to setup ROLES and store that data in the persist storage
     */


    // [TO DO] find a way to safely load JSON data without accidentally processing any functions or malicious code
    var url = msg.body.text
    var jsonData = null

    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
          // [DEBUG]
          //console.log(body) // Print the json response
          jsonData = body

          // [DEBUG]
          //console.info(`Character data loaded. Author: ${jsonData.author}`)

          // [DEBUG]
          //console.info(`${jsonData.characters}`)

          var characters = jsonData.characters

          // [TO DO] validate the data and handle any errors

          characters.forEach (function(character){
            kv.set(`${userID}::NPC::${character.name}`, { name: character.name, thumb: character.thumb, color: character.color, sheet_url: character.sheet_url }, function (err) {
              //[TO DO] handle error
            })
          })            
        }
    })
  })
}

//'https://u8921732.dl.dropboxusercontent.com/u/8921732/slack/thumbs/ar_jenkins.png'
