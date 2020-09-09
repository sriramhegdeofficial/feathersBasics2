const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

class MessageService {

    constructor() {
        this.messages = [];
    }

    async find() {
        return this.messages;
    }

    async create(data) {
        const message = {
            id: this.messages.length,
            text: data.text
        }

        this.messages.push(message);

        return message;
        
    }

    
}

const app = express(feathers());
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.configure(express.rest());
app.configure(socketio());
app.use(express.errorHandler());

app.on('connection', connection =>
  app.channel('everybody').join(connection)
);


port = process.env.PORT || app.get('port');

app.listen(port).on('listening', () =>
  console.log('Feathers server listening on localhost:3030')
);

app.publish(data => app.channel('everybody'));

app.use('messages', new MessageService());

app.service('messages').on('created', message => {
    console.log('A new message has been created', message);
  });

  app.service('messages').create({
    text: 'Hello world from the server'
  });