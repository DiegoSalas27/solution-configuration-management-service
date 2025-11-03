import { bootstrap } from './config/app'
import { startLLMHealthCheckMonitor } from './llm-health-check-monitor'

const port = 3001

bootstrap()
  .then(app => {
    app.listen(port, () => console.log(`Listening on port ${port}`))
    startLLMHealthCheckMonitor()
  })
  .catch(error => {
    console.error('Failed to start app', error)
    process.exit(1)
  })
