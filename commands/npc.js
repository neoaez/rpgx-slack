

module.exports = (app, text) => {
  let slapp = app.slapp
  let helpText = text
  let kv = app.dataStore

  // Slash Command: ... 
  slapp.command('/npc', (msg) => {

    var userID = msg.body.user_id
    console.info(`user: ${userID}`)
   
    var jsonData = msg.body.text

    // [TO DO] fine a way to safely load JSON data without accidentally processing any functions or malicious code

    console.info(`Character data loaded. Author: ${jsonData.author}`)
    
    jsonData.characters.foreach (function(character){

      // testing persist data
      kv.set(`${userID}::NPC::${character.name}`, { name: character.name, thumb: character.thumb, color: character.color, sheet_url: character.sheet_url }, function (err) {
        //[TO DO] handle error
      })
    })
  })
}

//'https://u8921732.dl.dropboxusercontent.com/u/8921732/slack/thumbs/ar_jenkins.png'
