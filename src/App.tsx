import React, { useState } from 'react'
import { AuthForm } from './components/AuthForm'
import { Layout } from './components/Layout'
import { ViewItemsPage } from './components/ViewItemsPage'
import { AddItemPage } from './components/AddItemPage'
import { EnquiriesPage } from './components/EnquiriesPage'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState<'view' | 'add' | 'enquiries'>('view')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white text-xl font-semibold">Loading InventoryPro...</p>
          <p className="text-white/70 text-sm mt-2">Please wait while we set up your workspace</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'view':
        return <ViewItemsPage />
      case 'add':
        return <AddItemPage />
      case 'enquiries':
        return <EnquiriesPage />
      default:
        return <ViewItemsPage />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  )
}