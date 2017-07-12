

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

    //testing persist data
    kv.get(`${userID}::NPC::${npcName}`, function (err, val) {
      // [TO DO] handle error
      msg.say({
        //response_type: 'in_channel',
        //text: 'Check out this amazing attachment! :confetti_ball: ',
        attachments: [{
          text: `${npcText}`,
          title: `${val.name}`,
          //image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
          //title_link: 'https://beepboophq.com/',
          //color: '#7CD197'
          color: "#4bbff4",
          mrkdwn_in: ["text", "pretext"],
          thumb_url: `${val.thumb}`
        }]
      })   
    })
  })
}
