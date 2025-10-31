import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen w-full">
      <Header />
      <Sidebar />
      <main className="pt-28 lg:pl-72 pr-4 pb-8">
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
