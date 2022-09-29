
const pino = require('pino')
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

class Base {
  constructor({name}) {
    this.name = name;
    this.logger = logger.child({name: this.name});
  }

    async subscribe({topic}) {
        //need to be implemented
    }

    async publish({topic, data}) {
        //need to be implemented
    }

    async start() {
        //need to be implemented
    }

    async stop() {
        //need to be implemented
    }
    
}

module.exports = Base;