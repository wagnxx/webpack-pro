module.exports = app => {
  app.get('/api/', (req, res) => {
    res.send('hello api test')
  })
}