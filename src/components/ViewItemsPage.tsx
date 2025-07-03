import React, { useState, useEffect } from 'react'
import { Package, Eye, Search, Filter, Sparkles, Grid, List, Heart } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { ItemModal } from './ItemModal'

interface Item {
  id: string
  created_at: string
  user_id: string
  name: string
  type: string
  description: string
  cover_image: string
  additional_images: string[]
}

export function ViewItemsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchItems()
  }, [user])

  const fetchItems = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filterType || item.type === filterType
    return matchesSearch && matchesFilter
  })

  const itemTypes = [...new Set(items.map(item => item.type))].sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl font-semibold">Loading your amazing items...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your inventory</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 flex items-center justify-center">
            <Package className="w-12 h-12 mr-4 text-blue-500" />
            Your Amazing Items
            <Sparkles className="w-8 h-8 ml-4 text-yellow-500 animate-pulse" />
          </h1>
          <p className="text-gray-600 text-xl">Discover and manage your incredible inventory collection</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search your items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-lg backdrop-blur-lg bg-white/80"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-12 pr-8 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-lg text-lg min-w-48"
              >
                <option value="">All Categories</option>
                {itemTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 border-2 border-gray-200 shadow-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Package className="w-16 h-16 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-600 mb-4">
            {items.length === 0 ? 'No items in your inventory yet! 📦' : 'No matching items found 🔍'}
          </h3>
          <p className="text-gray-500 text-lg mb-8">
            {items.length === 0 
              ? 'Start building your amazing inventory by adding your first item'
              : 'Try adjusting your search or filter criteria to find what you\'re looking for'
            }
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
          : "space-y-6"
        }>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-white/50 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer relative ${
                viewMode === 'list' ? 'flex items-center p-6' : ''
              }`}
              onClick={() => setSelectedItem(item)}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="relative aspect-w-1 aspect-h-1 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={item.cover_image}
                      alt={item.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-white/90 backdrop-blur-lg rounded-full p-4 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Eye className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Heart className="w-6 h-6 text-red-500 hover:fill-current cursor-pointer" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 truncate flex-1">
                        {item.name}
                      </h3>
                      <Sparkles className="w-5 h-5 text-yellow-500 ml-2 animate-pulse" />
                    </div>
                    <div className="flex items-center mb-4">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        Added {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-shrink-0 mr-6">
                    <img
                      src={item.cover_image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {item.name}
                      </h3>
                      <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                    </div>
                    <div className="flex items-center mb-3">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg mr-4">
                        {item.type}
                      </span>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        Added {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}