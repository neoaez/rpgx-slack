

module.exports = (app, text) => {
  let slapp = app.slapp
  let helpText = text
  let kv = app.dataStore

  // Slash Command: ... 
  slapp.command('/npc', (msg) => {

    var userID = msg.body.event.user
    console.info(`user: ${userID}`)
   
    var npcName = "SomeRandomNPCName"
    var npcThumb = null
    if (msg.body.event.text.indexOf('|') != -1) {
      var commandParameters = msg.body.event.text.split('|')
      npcName = commandParameters[0]
    } else {
      npcName = msg.body.event.text
    }

    // testing persist data
    kv.set(`${userID}::NPC::${npcName}`, { name: npcName, thumb: npcThumb }, function (err) {
      //[TO DO] handle error
    })
  })
}

//'https://u8921732.dl.dropboxusercontent.com/u/8921732/slack/thumbs/ar_jenkins.png'
