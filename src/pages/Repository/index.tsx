import React, { useEffect, useState } from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { FiChevronLeft } from 'react-icons/fi'
import api from '../../services/api'
import { Header, RepositoryInfo, Issues } from './styles'

import logo from '../../assets/logo.svg'

interface RepositoryParams {
  repository: string
}

interface RepositoryDTO {
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  owner: {
    login: string
    avatar_url: string
  }
}

interface IssuesDTO {
  id: number
  title: string
  html_url: string
  user: {
    login: string
  }
  state: string
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<RepositoryDTO | null>(null)
  const [issues, setIssues] = useState<IssuesDTO[]>([])
  const { params } = useRouteMatch<RepositoryParams>()

  useEffect(() => {
    async function load() {
      const [getRepository, getIssues] = await Promise.all([
        api.get<RepositoryDTO>(`repos/${params.repository}`),
        api.get<IssuesDTO[]>(`repos/${params.repository}/issues`),
      ])

      const repository = getRepository.data
      setRepository(repository)
      const issues = getIssues.data
      setIssues(issues)
    }

    load()
  }, [params.repository])

  return (
    <>
      <Header>
        <img src={logo} alt="Github" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Estrelas</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}
      <Issues>
        {issues.map((issue) => (
          <a
            key={issue.id}
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronLeft size={20} />
          </a>
        ))}
      </Issues>
    </>
  )
}

export default Repository
