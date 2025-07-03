import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Mail, MessageCircle, Check, Loader2, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

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

interface ItemModalProps {
  item: Item
  onClose: () => void
}

export function ItemModal({ item, onClose }: ItemModalProps) {
  const { user } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)
  const [enquiryEmail, setEnquiryEmail] = useState('')
  const [enquiryMessage, setEnquiryMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const allImages = [item.cover_image, ...item.additional_images]

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('enquiries')
        .insert({
          user_id: item.user_id,
          item_id: item.id,
          enquirer_email: enquiryEmail,
          message: enquiryMessage || `I'm interested in your ${item.name}. Please contact me for more details.`,
        })

      if (insertError) throw insertError

      setSuccess(true)
      setEnquiryEmail('')
      setEnquiryMessage('')
      
      // Hide form and show success for 3 seconds
      setTimeout(() => {
        setSuccess(false)
        setShowEnquiryForm(false)
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to send enquiry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-3xl font-bold text-white">{item.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <X className="w-7 h-7 text-white" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Carousel */}
            <div className="space-y-6">
              <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${item.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </div>

              {allImages.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 transform hover:scale-105 ${
                        index === currentImageIndex
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="space-y-8">
              <div>
                <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {item.type}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{item.description}</p>
              </div>

              <div className="border-t-2 border-gray-100 pt-8">
                <p className="text-sm text-gray-500 mb-6 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Added on {new Date(item.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>

                {!showEnquiryForm && !success ? (
                  <button
                    onClick={() => setShowEnquiryForm(true)}
                    className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center text-lg"
                  >
                    <Mail className="w-6 h-6 mr-3" />
                    Send Enquiry
                  </button>
                ) : success ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 flex items-center animate-pulse">
                    <Check className="w-8 h-8 text-green-600 mr-4" />
                    <div>
                      <p className="text-green-600 font-bold text-lg">Enquiry sent successfully!</p>
                      <p className="text-green-500 text-sm mt-1">Your enquiry has been stored in the database and the owner will be notified.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Send className="w-6 h-6 mr-3 text-blue-500" />
                      Send Your Enquiry
                    </h4>
                    
                    <form onSubmit={handleEnquiry} className="space-y-6">
                      <div>
                        <label className="block text-gray-800 text-sm font-semibold mb-3">
                          Your Email Address
                        </label>
                        <input
                          type="email"
                          value={enquiryEmail}
                          onChange={(e) => setEnquiryEmail(e.target.value)}
                          className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-800 text-sm font-semibold mb-3">
                          Your Message (Optional)
                        </label>
                        <textarea
                          value={enquiryMessage}
                          onChange={(e) => setEnquiryMessage(e.target.value)}
                          rows={4}
                          className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                          placeholder={`I'm interested in your ${item.name}. Please contact me for more details.`}
                        />
                      </div>

                      {error && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-pulse">
                          <p className="text-red-600 font-medium">{error}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowEnquiryForm(false)}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Enquiry
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}