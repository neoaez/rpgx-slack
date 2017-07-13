
var request = require('request')

module.exports = (app, text) => {
  let slapp = app.slapp
  let helpText = text
  let kv = app.dataStore

  // Slash Command: ... 
  slapp.command('/npc', (msg) => {

    var userID = msg.body.user_id
    console.info(`user: ${userID}`)

    // [TO DO] fine a way to safely load JSON data without accidentally processing any functions or malicious code
    var url = msg.body.text
    var jsonData = null

    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
          console.log(body) // Print the json response
          jsonData = body

          console.info(`Character data loaded. Author: ${jsonData.author}`)

          console.info(`${jsonData.characters}`)

          var characters = jsonData.characters

          characters.forEach (function(character){

            // testing persist data
            kv.set(`${userID}::NPC::${character.name}`, { name: character.name, thumb: character.thumb, color: character.color, sheet_url: character.sheet_url }, function (err) {
              //[TO DO] handle error
            })
          })            
        }
    })
  })
}

//'https://u8921732.dl.dropboxusercontent.com/u/8921732/slack/thumbs/ar_jenkins.png'
