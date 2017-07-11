

module.exports = (app) => {
  let slapp = app.slapp

  // response to the user typing "help"
  slapp.message('help', ['mention', 'direct_message'], (msg) => {
    msg.say(HELP_TEXT)//,

    // testing persist data
    //DataStore.set('u::c::jenkins', { name: 'Jenkins', thumb: 'https://u8921732.dl.dropboxusercontent.com/u/8921732/slack/thumbs/ar_jenkins.png' }, function (err) {
      // [TO DO] handle error
    //})
  })
}
