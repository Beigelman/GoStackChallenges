import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import api from './services/api'

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    async function get_repositories() {
      const response = await api.get('/repositories')
      setRepositories(response.data)
    }

    get_repositories()
  }, [])

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: 'Desafio 2',
      url: 'https://github.com/Beigelman/desafio2',
      techs: ['Node.JS', 'ReactJS'],
    })

    setRepositories((repository) => [...repository, response.data])
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`)

    setRepositories(repositories.filter(repository => repository.id !== id))
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
