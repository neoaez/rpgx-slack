

module.exports = (app, text) => {
  let slapp = app.slapp
  let helpText = text
  let kv = app.dataStore

  // response to the user typing "help"
  slapp.message('help', ['mention', 'direct_message'], (msg) => {
    msg.say(helpText)//,

    // testing persist data
    kv.set('u::c::jenkins', { name: 'Jenkins', thumb: 'https://u8921732.dl.dropboxusercontent.com/u/8921732/slack/thumbs/ar_jenkins.png' }, function (err) {
      [TO DO] handle error
    })
  })
}
