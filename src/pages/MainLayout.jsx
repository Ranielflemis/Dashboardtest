import React from 'react'
import Header from "../components/layout/Header/Header"
import Sidebar from "../components/layout/Sidebar/Sidebar"
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="flex flex-col w-full h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout