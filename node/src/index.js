const { response } = require('express')
const cors = require('cors')
const express = require('express')
const { uuid, isUuid } = require('uuidv4')// ID único

const app = express()

app.use(cors())
app.use(express.json())

/* 
   Métodos HTTP:

   GET: Buscar informações do Back-end.
   POST: Criar uma informação no Back-end.
   PUT/PATCH: Alterar uma informação.
   DELETE: Deletar uma informação no Back-end.
*/

/*
  Parâmetros:

  Query params: Filtros e paginação. GET,
  Route params: Identificar recursos na hora de atualizar ou deletar. DELETE & PUT.
  Request Body: Conteúdo na hora de criar ou editar um recurso (JSON).
*/

/*
  MIDDLEWARE:

  Interceptador de requisições que pode interromper totalmente a requisição
  ou alterar dados da requisição.
*/

const projects = []

function logRequests(request, response, next) {
  const { method, url } = request
  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.log(logLabel)

  console.time(logRequests)

  return next()

  console.timeEnd(logRequests)
}

function validateProjectId(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalide project ID.' })
  }

  return next()
}

app.use(logRequests)
app.use('/projects/:id', validateProjectId) // aplicando middeware em apenas uma rota.

// Usando o método GET, listando um array de projetos.
app.get('/projects', (request, response) => {
  const { title } = request.query // { a, b } desestruturação JS.
  
  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects

  return response.json(results)
})

// Criando um método POST, para criar projetos.
app.post('/projects', (request, response) => {
  const { title, owner } = request.body

  const project = { id: uuid(), title, owner }
  projects.push(project)

  return response.json(project)
})

// Método PUT que modifica algum projeto.
app.put('/projects/:id', (request, response) => {
  const { id } = request.params
  const { title, owner } = request.body

  const projectIndex = projects.findIndex(project => project.id === id)

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' })
  }

  const project = { id, title, owner }

  projects[projectIndex] = project
  return response.json(project)
})

// Método DELETE para deletar algum projeto.
app.delete('/projects/:id', (request, response) => {
  const { id } = request.params

  const projectIndex = projects.findIndex(project => project.id === id)

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' })
  }

  projects.splice(projectIndex, 1)

  return response.status(204).send()
})

// Definindo uma porta para usarmos na nossa aplicação e
// retornando uma mensagem para o nosso terminal indicando 
// que nosso back-end está rodando normalmente.
app.listen(3333, () => {
  console.log('✔ Back-end started...')
})