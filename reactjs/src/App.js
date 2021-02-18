import React, { useState, useEffect } from 'react'
import Header from "./components/Header"
import './App.css'

import api from './services/api'

/*
* O que compõe todas as aplicações do ReactJS
* 
* Componentes
* Propriedades: informação passada de pai para filho.
* Estado & Imutabilidade (performance):
*/

function App() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    api.get('projects').then(response => {
      setProjects(response.data)
    })
  }, [])

  // useState retorna um array com duas posições...
  //
  // 1. Variável com o seu valor inicial.
  // 2. Função para atualizarmos esse valor.

  async function handleAddProject() { // handle = tratando...
    
    // Usando api para adicionar um novo projeto...
    
    /*   USANDO ASYNC AWAIT
      const response = await api.post('projects', {
        title: `New project ${Date.now()}`,
        owner: "Wally"
      })

      const project = response.data
      setProjects([...projects, project])
    */
    
    //   USANDO O .then()...
    api.post('projects', {
      title: `New project ${Date.now()}`,
      owner: "Wally"
    }).then(response => {
      setProjects([...projects, response.data])
    })
    
    // projects.push(`New project ${Date.now}`), forma tradicional...
    // setProjects([...projects,`New project ${Date.now()}`]) // os três "..." copia tudo para o novo array.
  }

  return (
    <>
      <Header title="Homepage">

        
        <ul>
          <li>Home</li>
          <li>Login</li>
        </ul>
      </Header>

      <ul> 
        { projects.map(project => <li key={ project.id }>{ project.title }</li>) }
      </ul>

      <button type="button" onClick={handleAddProject}>Add project</button>

      <Header title="Projects" />
    </>
  ) 
}

export default App