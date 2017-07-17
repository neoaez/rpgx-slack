
var request = require('request')

module.exports = (app, text) => {
  
  const dataSeparator = '|'
  const defaultCharacterColor = '#006666'
  
  let slapp = app.slapp
  let helpText = text
  let kv = app.dataStore

  // Slash Command: ... 
  slapp.command('/char_add', (msg) => {

    var userID = msg.body.user_id
    console.info(`user: ${userID}`)
    /** [TO DO] restrict access to this command to the channel owner and those authorized
     * 
     * will need to setup ROLES and store that data in the persist storage
     */

    var characterData = msg.body.text.split(dataSeparator)
    var characterName = ''
    var characterThumb = ''
    var characterColor = defaultCharacterColor
    
    if (characterData) {
      if (characterData[0] != '' && characterData.length > 0) { characterName = characterData[0]}
      if (characterData[1] != '' && characterData.length > 1) { characterThumb = characterData[1]}
      if (characterData[2] != '' && characterData.length > 2) { characterColor = characterData[2]}
      if (characterData[3] != '' && characterData.length > 3) { characterSheet = characterData[3]}        
    } else {
      // [TO DO] handle error
    }

    // [DEBUG]
    console.info(`character data: ${characterData}`)


    if (characterName != '') {
      kv.set(`${userID}::NPC::${characterName}`, { name: characterName, thumb: characterThumb, color: characterColor, sheet_url: characterSheet_url }, function (err) {
        //[TO DO] handle error
      })
    } else {
      // [TO DO] handle error
    }
  })            
}
//'https://u8921732.dl.dropboxusercontent.com/u/8921732/slack/thumbs/ar_jenkins.png'
