import React, { useState, useEffect } from 'react'
import { MessageCircle, Mail, Calendar, Package, User, Search, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface Enquiry {
  id: string
  created_at: string
  enquirer_email: string
  message: string
  items: {
    name: string
    type: string
    cover_image: string
  }
}

export function EnquiriesPage() {
  const { user } = useAuth()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEnquiries()
  }, [user])

  const fetchEnquiries = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select(`
          id,
          created_at,
          enquirer_email,
          message,
          items (
            name,
            type,
            cover_image
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEnquiries(data || [])
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEnquiries = enquiries.filter(enquiry =>
    enquiry.enquirer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.items.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading enquiries...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
          <MessageCircle className="w-10 h-10 mr-4 text-emerald-500" />
          Enquiries Received
        </h1>
        <p className="text-gray-600 text-lg">Manage and respond to customer enquiries about your items</p>
        
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {filteredEnquiries.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-16 h-16 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-3">
            {enquiries.length === 0 ? 'No enquiries yet' : 'No matching enquiries found'}
          </h3>
          <p className="text-gray-500 text-lg">
            {enquiries.length === 0 
              ? 'When customers enquire about your items, they will appear here'
              : 'Try adjusting your search criteria'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEnquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={enquiry.items.cover_image}
                      alt={enquiry.items.name}
                      className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-xl shadow-lg"
                    />
                  </div>

                  {/* Enquiry Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <Package className="w-5 h-5 mr-2 text-blue-500" />
                          {enquiry.items.name}
                        </h3>
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
                          {enquiry.items.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-gray-500 text-sm mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(enquiry.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-3">
                        <User className="w-5 h-5 text-emerald-500 mr-2" />
                        <span className="font-semibold text-gray-900">Customer Details</span>
                      </div>
                      <div className="flex items-center text-gray-700 mb-2">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        <a 
                          href={`mailto:${enquiry.enquirer_email}`}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                        >
                          {enquiry.enquirer_email}
                        </a>
                      </div>
                    </div>

                    {enquiry.message && (
                      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 border-l-4 border-emerald-500">
                        <div className="flex items-center mb-2">
                          <MessageCircle className="w-5 h-5 text-emerald-500 mr-2" />
                          <span className="font-semibold text-gray-900">Message</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{enquiry.message}</p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <a
                        href={`mailto:${enquiry.enquirer_email}?subject=Re: Enquiry about ${enquiry.items.name}&body=Hi,%0D%0A%0D%0AThank you for your enquiry about ${enquiry.items.name}.%0D%0A%0D%0ABest regards`}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Reply via Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}