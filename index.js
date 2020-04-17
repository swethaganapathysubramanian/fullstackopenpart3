const express = require('express')
const app = express();
const cors = require('cors');
var morgan = require('morgan')

//3.9,3.10,3.11 deployment and frontend connection
app.use(express.static('build'))
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

let persons = [
        {
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
        },
        {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 2
        },
        {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 3
        },
        {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": 4
        },
        {
            "name": "NewModuleAddCheck",
            "number": "100100100100",
            "id": 6
        },
        {
            "name": "Harry Potter",
            "number": "9087654",
            "id": 7
        },
        {
            "name": "Damon",
            "number": "123",
            "id": 8
        },
        {
            "name": "Contact",
            "number": "908",
            "id": 11
        },
        {
            "name": "Notification ",
            "number": "789",
            "id": 13
        },
    {
        "name": "Notification 2",
        "number": "789",
        "id": 14
    }        
    ]
//use Morgan Tiny 3.7
//app.use(morgan('tiny'))

//3.8 Morgan logs with Post method change
morgan.token('post', function (req, res) { 
    if (req.method === 'POST'){
    return JSON.stringify(req.body) }
    else{
        return " "
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));

//Root Url
app.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>")
})

//List all persons 3.1
app.get('/api/persons', (req,res) => {
    res.json(persons)
})

//info page 3.2
app.get('/api/info', (req,res)=> {
    const len = persons.length;
    const date = Date();
    res.send(`<p>Phonebook has info of ${len} people </p> ${date}`)
})

//single person record 3.3
app.get('/api/persons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }
    else{
        res.status(404).end()
    }
})

//Delete single record 3.4
app.delete('/api/persons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

//POST requests 3.5 & 3.6(Name Unique)
app.post('/api/persons', (req, res) => {
    const id = Math.floor(Math.random() * Math.floor(1000));
    if(req.body.name && req.body.number) {
    if(persons.some(person=> person.name === req.body.name)){
        return res.status(404).json({ error: "Name must be unique" });
    }
    const person = {
        "name": req.body.name,
        "number": req.body.number,
        "id": id
    }
    persons = persons.concat(person)
    
    app.use(morgan(':post'))
    res.send("Added Successfully")
}
    else{
        res.send("Details missing")
    }
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`App is listening to port ${PORT}`);
})