const fs = require('fs')

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia  } = require('whatsapp-web.js');
const whatsapp = new Client({
    authStrategy: new LocalAuth()
});

const express = require('express');
const app = express();
const port = 80;

// Lectura y parseo del body
app.use(express.json());

// whatsapp
whatsapp.on('qr', qr => {
    qrcode.generate(qr, {
        small: true
    });
});

whatsapp.on('ready', () => {
    console.log('Client is ready!');
});

whatsapp.on('message', async message => {
	if(message.body === '!ping') {
		message.reply('pong');
        console.log(message.from);
	}
});

app.post('/send-whatsapp-notification', async (req, res) => {
    const { country_code, number_phone, message } = req.body;
    
    // var parents = fs.readFileSync('parents.json');
    // parents = JSON.parse(parents);

    // for (var i = 0; i < parents.length; i++) {
    //     console.log(`Numero ${parents[i].number + '@c.us'}`);
    //     var numbers = parents[i].number + '@c.us';
    //     var text = "Dear Mr/Mrs " + parents[i].number + ", \nwe inform you that " + parents[i].student + " is ..... . \nThank you";
        
    //     whatsapp.sendMessage(numbers, text);
    // }
    // res.send(parents);

    const finalNumber = `${country_code}${number_phone}@c.us`;

    // const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');

    // whatsapp.sendMessage(finalNumber, media, { caption: 'this is my caption' });
    whatsapp.sendMessage(finalNumber, message);
    res.send({
        "send_message": true,
        "number": number_phone,
        "message": message
    });

})

whatsapp.initialize();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})