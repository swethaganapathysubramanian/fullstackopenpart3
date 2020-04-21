require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')

const Person = require('./models/person')

//3.9,3.10,3.11 deployment and frontend connection
app.use(express.static('build'))
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended:false }))

//use Morgan Tiny 3.7
//app.use(morgan('tiny'))

//3.8 Morgan logs with Post method change
morgan.token('post', function (req, res) {

  if (req.method === 'POST'){
    return JSON.stringify(req.body) }
  else{
    return ' '
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

//Root Url
app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

//List all persons 3.1
// app.get('/api/persons', (req,res) => {
//     res.json(persons)
// })
//3.13
app.get('/api/persons', (req,res) => {
  Person.find({}).then(people => {
    res.json(people.map(person => person.toJSON()))
  })
})

//info page 3.2
app.get('/api/info', (req,res) => {
  var len = 0
  const date = Date()
  Person.find({}).then(people => {
    len = people.length
    res.send(`<p>Phonebook has info of ${len} people </p> ${date}`)
  })
})

//single person record 3.3
//3.18
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  //const person = persons.find(person => person.id === id)
  Person.findById(id)
    .then(person => {
      if(person){
        res.json(person)
      }
      else{
        res.status(404).end()
      }
    })
    .catch (error => {
      //console.log(error)
      next(error)
    })
})

//Delete single record 3.4
//3.15
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  //persons = persons.filter(person => person.id !== id)
  Person.findByIdAndDelete(id)
    .then(result => {
      console.log(result)
    })
    .catch(err => next(err))
})

//POST requests 3.5 & 3.6(Name Unique)
//3.14
app.post('/api/persons', (req, res) => {
  //const id = Math.floor(Math.random() * Math.floor(1000));
  if(req.body.name && req.body.number) {
    // if(persons.some(person=> person.name === req.body.name)){
    //     return res.status(404).json({ error: "Name must be unique" });
    // }
    Person.find({ name: req.body.name }).then(result => {
      if (result.length !== 0){
        return res.status(404).json({ error: 'Name must be unique' })
      }

      else {
        const person =new Person({
          'name': req.body.name,
          'number': req.body.number,
        })
        person.save().then(saved => {
          res.json(saved.toJSON())
        }).catch(err => {
          res.send(err.message)

        })
      }
    })
  }
  else{
    res.send('Details missing')
  }
})
//3.17 update in db
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const personData = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, personData, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(err => next(err))
})

//3.16
// const unknownEndpoint = (error, request, response, next) => {
//     response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log('Error happend')
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`)
})