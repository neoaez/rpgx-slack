

module.exports = (app) => {
  let slapp = app.slapp

  // Can use a regex as well
  slapp.message(/^(thanks|thank you)/i, ['mention', 'direct_message'], (msg) => {
    // You can provide a list of responses, and a random one will be chosen
    // You can also include slack emoji in your responses
    msg.say([
      "You're welcome :smile:",
      'You bet',
      ':+1: Of course',
      'Anytime :sun_with_face: :full_moon_with_face:'
    ])
  })
}
