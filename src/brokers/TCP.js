const cote = require('cote');
const Base = require('./Base');



class TCP extends Base{

    constructor({name}){
        super({name});
        this.responser = new cote.Responder({name, key: 'arbitration', namespace: 'arbitration'});
        this.requester = new cote.Requester({name, key: 'arbitration', namespace: 'arbitration'});
    }


    async subscribe({topic}){
        return new Promise((resolve, reject) => {
            this.responser.on(topic, (req, cb) => {
                resolve(req);
                cb();
            });
        });
    }

    async publish({topic, data}){
        return new Promise((resolve, reject) => {
            this.requester.send({type: topic, data}, (res) => {
                resolve(res);
            });
        });
    }


}

module.exports = TCP;