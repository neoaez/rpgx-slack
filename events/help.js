

module.exports = (app, text) => {
  let slapp = app.slapp
  let helpText = text
  let kv = app.dataStore

  // response to the user typing "help"
  slapp.message('help', ['mention', 'direct_message'], (msg) => {
    msg.say(helpText)
}
