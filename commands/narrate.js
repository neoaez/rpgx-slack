

module.exports = (app, text) => {
  let slapp = app.slapp
  let helpText = text
  let kv = app.dataStore

  // Slash Command: ... 
  slapp.command('/narrate', (msg) => {

    //testing persist data
    kv.get('u::c::jenkins', function (err, val) {
      // [TO DO] handle error
      msg.say([
        `Data retrieved: ${val.thumb}`,
      ])   
    })
  })
}
