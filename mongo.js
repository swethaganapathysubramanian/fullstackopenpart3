const mongoose = require('mongoose');


if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]


const url = `mongodb+srv://contact:${password}@cluster0-d4b8i.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const contactData = new mongoose.Schema({
    name: String,
    number: Number
})

const Contact = mongoose.model('Contact', contactData);

//3.12 command line argument input
if (process.argv.length === 3) {
    Contact.find({}).then(contacts => {
        contacts.forEach(contact=>{
        console.log(`${contact.name}: ${contact.number}`);
        })
        mongoose.connection.close();
    })
}

if(process.argv.length >3){
    const name = process.argv[3]
    const number = process.argv[4]
    const contactDetail = {
        name: name,
        number: number
    }

Contact.create(contactDetail).then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
})
}

