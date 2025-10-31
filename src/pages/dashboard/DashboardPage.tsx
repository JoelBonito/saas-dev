import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DashboardPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/dashboard/projects')
  }, [navigate])

  return (
    <div className="flex h-full items-center justify-center">
      <p>Redirecionando...</p>
    </div>
  )
}

export default DashboardPage
