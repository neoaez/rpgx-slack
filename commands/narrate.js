

module.exports = (app, text) => {
  let slapp = app.slapp
  let helpText = text
  let kv = app.dataStore

  // Slash Command: ... 
  slapp.command('/narrate', (msg) => {

    var userID = msg.body.user_id
    console.info(`user: ${userID}`)
   
    var npcName = null
    var npcText = null

    if (msg.body.text.indexOf('|') != -1) {
      var commandParameters = msg.body.text.split('|')
      npcName = commandParameters[0]
      npcText = commandParameters[1]
    } else {
        npcText = msg.body.text
    }

    if (npcName) {

      //testing persist data
      kv.get(`${userID}::NPC::${npcName}`, function (err, val) {
        if (!err) {
          msg.say({
            //response_type: 'in_channel',
            text: '',
            attachments: [{
              text: `${npcText}`,
              title: `${val.name}`,
              color: "#4bbff4",
              mrkdwn_in: ["text", "pretext"],
              thumb_url: `${val.thumb}`
            }]
          })
        } else {
          // [TO DO] handle error
        }   
      })
    } else {
        msg.say({
          //response_type: 'in_channel',
          text: '',
          attachments: [{
            text: `${npcText}`,
            color: "#4bbff4",
            mrkdwn_in: ["text", "pretext"],
          }]
        })          
    }
  })
}
