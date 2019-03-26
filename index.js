const express = require('express');
const helmet = require('helmet');
const knex = require('knex')

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  },
  debug: true,
}

const db = knex(knexConfig)

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

//Gets all Zoos in DB
server.get('/api/zoos', (req, res) => {
  db('zoos').then(data => {
    res.status(200).json(data)
  }).catch(error => {
    res.status(500).json(error)
  })
})

//Gets a Zoo by ID
server.get('/api/zoos/:id', (req, res) => {
  const { id } = req.params

  db('zoos').where({ id })
  .first()
  .then(zoo => {
    if(zoo > 0){
    res.status(200).json(zoo)
    }else{
      res.status(404).json({errorMessage: "This zoo does not exist"})
    }
  }).catch(error => {
    res.status(500).json(error)
  })
})

//Add a Zoo
server.post('/api/zoos', (req, res) => {
  db('zoos').insert(req.body).then(ids => {
    const id = ids[0];
    db('zoos').where({ id }).first().then(zoo=> {
      res.status(201).json(zoo)
    }).catch(error => {
      res.status(500).json({error: "There was a problem adding your zoo to the database"})
    })
  })
})

//Delete a Zoo 

server.delete('/api/zoos/:id', (req,res) => {
  const { id } = req.params
  db('zoos').where({ id }).del(zoo => {
    if(zoo > 0){
      res.status(204).end()
    }else{
      res.status(404).json({ message: "That Zoo does not exist"})
    }
  }).catch(error => {
    res.status(500).json({error: "An error occured trying to remove that zoo from the database"})
  })
});

//Update a Zoo
server.put('/api/zoos/:id', (req, res) => {
  const { id } =  req.params
  db('zoos').where({ id }).update(req.body).then(zoo => {
    if(zoo > 0){
      res.status(200).json(zoo)
    }else{
      res.status(404).json({ message: "That zoo does not exist"})
    }
  }).catch( error => {
    res.status(500).json({error: "An error occured updating this existing zoo"})
  })
})


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
