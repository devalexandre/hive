
const brokers = require('./const');

class ServiceBroker {  
    constructor(opts){
        this.name = opts.name;
        this.broker = new brokers[opts.brokerOpts.broker](opts.brokerOpts);
        this.req = `${this.name}-REQ`;
        this.res = `${this.name}-RES`;
        this.actions = opts.actions;
        
        
    }

    async call(cmd, payload){
        this.broker.logger.info('ServiceBroker: call');
       await this.broker.publish({topic: this.req, data: {
            requester: this.name,
            cmd,
            payload
        }});
       
        return this.broker.subscribe({topic: this.res})
    }

    async emmit (cmd, payload) {
        await this.broker.publish({topic: this.req, data: {
            requester: this.name,
            cmd,
            payload
        }});
    }

    validations(){
        if(!this.name){
            throw new Error('ServiceBroker: name is required');
        }
        if(!this.broker){
            throw new Error('ServiceBroker: broker is required');
        }
        if(!this.actions){
            throw new Error('ServiceBroker: actions is required');
        }
    }

    async start(){
        this.broker.logger.info('ServiceBroker: start');
            this.validations();
            if(Object.hasOwnProperty.call(this.broker, 'start')){
                await this.broker.start();
            }
        //    await this.received();
     
    }

    async stop(){
        if(Object.hasOwnProperty.call(this.broker, 'stop')){
            await this.broker.stop();
        }
    }

    async subscribe(){
        this.broker.logger.info('ServiceBroker: received');
       return  this.broker.subscribe({topic: `${this.name}.REQ`})
        .then((req) => {
            this.broker.logger.info(`ServiceBroker: ${this.name} received request`, req);
            let response;
            const { cmd, payload , requester } = JSON.parse(req);
            const [_, action] = cmd.split('.');
            if(this.actions.includes(action)){

                if(Object.hasOwnProperty.call(this[action], 'handler')){
                    if(Object.hasOwnProperty.call(this[action], 'params')){
                        const { params } = this[action];
                        const { data } = payload;
                        const errors = [];
                        Object.keys(params).forEach((key) => {
                            if(!data[key]){
                                errors.push(`${key} is required`);
                            }
                            if(data[key] && typeof data[key] !== params[key]){
                                errors.push(`${key} should be ${params[key]}`);
                            }
                        });
                        if(errors.length){
                            response = {
                                status: 500,
                                payload: errors
                            }
                        
                            this.broker.publish({topic: `${requester}-RES`, params: JSON.stringify(payload)});
                        } 
                    }

                    const res = this[action].handler(payload)
                    response = {
                        status: 200,
                        payload: res
                    }

                    this.broker.publish({topic: `${requester}-RES`, params: JSON.stringify(response)});
                }  else{

                  const res = this[action](payload)
                    response = {
                        status: 200,
                        payload: res
                    }
                    this.broker.logger.info('ServiceBroker: response', response);
                                 
                    this.broker.publish({topic: `${requester}-RES`, params: JSON.stringify(response)});
                }                        

            }
            else{
                response = new Error(`ServiceBroker: action ${action} not found`);
            }

           
        }
    );
    }
}

module.exports = ServiceBroker;