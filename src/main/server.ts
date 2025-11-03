import { bootstrap } from './config/app'

const port = 3001

bootstrap()
  .then(app => {
    app.listen(port, () => console.log(`Listening on port ${port}`))
  })
  .catch(error => {
    console.error('Failed to start app', error)
    process.exit(1)
  })
