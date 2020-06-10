import React, { useState, FormEvent } from 'react'
import { FiChevronRight } from 'react-icons/fi'

import api from '../../services/api'
import logo from '../../assets/logo.svg'
import { Title, Form, Repository, Error } from './styles'

interface GitHubDTO {
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('')
  const [inputError, setInputError] = useState('')
  const [repositories, setRepositories] = useState<GitHubDTO[]>([])

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()
    const [user, repo] = newRepo.split('/')
    if (!newRepo) {
      setInputError('Digite o autor e nome do repositório')
      return
    }

    try {
      if (!repo) {
        console.log(user)
        var responseList = await api.get<GitHubDTO[]>(`users/${user}/repos`)
        const repository = responseList.data

        for (let i = 0; i < repository.length; i++) {
          repositories.push(repository[i])
        }
        setRepositories([...repositories])
      } else {
        var responseOne = await api.get<GitHubDTO>(`repos/${user}/${repo}`)
        const repository = responseOne.data
        setRepositories([...repositories, repository])
      }
      setNewRepo('')
      setInputError('')
    } catch (err) {
      setInputError('Erro na busca por ess repositório')
    }
  }

  return (
    <>
      <img src={logo} alt="Github" />
      <Title>Explore repositórios no Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repository>
        {repositories.map((repository) => (
          <a key={repository.full_name} href="test">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repository>
    </>
  )
}

export default Dashboard
