'use strict'

module.exports = (app, text) => {
  let slapp = app.slapp
  let helpText = text
  let kv = app.dataStore

  // Slash Command: ... 
  slapp.command('/narrate', (msg) => {

    const defaultNPCColor = '#006666'

    const contextSymbol = ':'

    var userID = msg.body.user_id
    console.info(`user: ${userID}`)
   
    var npcName = null
    var npcText = null
    var npcThumb = ''
    var npcColor = defaultNPCColor

    if (msg.body.text.indexOf(contextSymbol) != -1) {
      var commandParameters = msg.body.text.split(contextSymbol)
      npcName = commandParameters[0]
      npcText = commandParameters[1]
    } else {
        npcText = msg.body.text
    }

    if (npcName) {

      // retrieve npc data if it exists
      kv.get(`${userID}::NPC::${npcName}`, function (err, val) {
        if (!err) {
          if (val) {
            // [DEBUG]
            console.info (`[DEBUG] retrieved data: ${val}`)

            if (val.thumb) { npcThumb = val.thumb }
            if (val.color) { npcColor = val.color }
          } 
          msg.say({
            response_type: 'in_channel',
            username: `${npcName}   (@${msg.body.user_name})`,
            icon_url: npcThumb,
            text: '',
            attachments: [{
              text: `${npcText}`,
              //title: `${npcName}`,
              color: `${npcColor}`,
              mrkdwn_in: ["text", "pretext"],
              //thumb_url: `${npcThumb}`
            }]
          })
        } else {
          // [TO DO] handle error
        }   
      })
    } else {
        msg.say({
          response_type: 'in_channel',
          text: '',
          attachments: [{
            text: `${npcText}`,
            color: `${npcColor}`,
            mrkdwn_in: ["text", "pretext"],
          }]
        })          
    }
  })
}
