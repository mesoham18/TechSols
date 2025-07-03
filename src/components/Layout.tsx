import React, { useState } from 'react'
import { Package, Plus, LogOut, Menu, X, User, MessageCircle, Sparkles, Bell } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface LayoutProps {
  children: React.ReactNode
  currentPage: 'view' | 'add' | 'enquiries'
  onPageChange: (page: 'view' | 'add' | 'enquiries') => void
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  const navigationItems = [
    {
      key: 'view' as const,
      label: 'View Items',
      icon: Package,
      gradient: 'from-blue-500 via-purple-500 to-indigo-600',
      hoverGradient: 'hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700',
      description: 'Browse your inventory'
    },
    {
      key: 'add' as const,
      label: 'Add Item',
      icon: Plus,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      hoverGradient: 'hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700',
      description: 'Add new items'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <nav className="bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent flex items-center">
                  InventoryPro
                  <Sparkles className="w-6 h-6 ml-2 text-yellow-500 animate-pulse" />
                </h1>
                <p className="text-sm text-gray-500 font-medium">Professional Inventory Management System</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.key}
                    onClick={() => onPageChange(item.key)}
                    className={`group relative px-6 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center transform hover:scale-105 ${
                      currentPage === item.key
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl`
                        : `text-gray-600 hover:text-white bg-gradient-to-r ${item.hoverGradient} hover:shadow-xl`
                    }`}
                  >
                    <Icon className="w-6 h-6 mr-3" />
                    <div className="text-left">
                      <div className="text-sm font-bold">{item.label}</div>
                      <div className="text-xs opacity-80">{item.description}</div>
                    </div>
                    {currentPage === item.key && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    )}
                  </button>
                )
              })}
              
              <div className="flex items-center text-gray-700 px-6 py-4 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-2xl shadow-lg border border-gray-200/50 ml-6 backdrop-blur-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Welcome back!</div>
                  <div className="text-xs text-gray-600 truncate max-w-32">{user?.email}</div>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="group text-gray-600 hover:text-red-600 p-4 rounded-2xl hover:bg-red-50 transition-all duration-300 transform hover:scale-105 border border-gray-200/50 hover:border-red-200"
              >
                <LogOut className="w-6 h-6 group-hover:animate-pulse" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-4 rounded-2xl text-gray-600 hover:bg-gray-100 transition-all duration-300 border border-gray-200/50"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      onPageChange(item.key)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full px-6 py-5 rounded-2xl font-bold transition-all duration-300 flex items-center ${
                      currentPage === item.key
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl`
                        : `text-gray-600 hover:bg-gradient-to-r ${item.hoverGradient} hover:text-white hover:shadow-xl`
                    }`}
                  >
                    <Icon className="w-6 h-6 mr-4" />
                    <div className="text-left">
                      <div className="text-sm font-bold">{item.label}</div>
                      <div className="text-xs opacity-80">{item.description}</div>
                    </div>
                  </button>
                )
              })}
              
              <div className="flex items-center text-gray-700 px-6 py-5 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-2xl shadow-lg border border-gray-200/50">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Welcome back!</div>
                  <div className="text-xs text-gray-600">{user?.email}</div>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="w-full text-left px-6 py-5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 flex items-center border border-gray-200/50 hover:border-red-200"
              >
                <LogOut className="w-6 h-6 mr-4" />
                <div>
                  <div className="text-sm font-bold">Sign Out</div>
                  <div className="text-xs opacity-80">Exit your account</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {children}
      </main>
    </div>
  )
}