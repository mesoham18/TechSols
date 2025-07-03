import React, { useState } from 'react'
import { Upload, Image as ImageIcon, Check, Loader2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const ITEM_TYPES = [
  'Shirt',
  'Pant',
  'Shoes',
  'Sports Gear',
  'Electronics',
  'Accessories',
  'Books',
  'Home & Garden',
  'Other'
]

export function AddItemPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
  })
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>('')
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = [...additionalImages, ...files].slice(0, 5)
    setAdditionalImages(newFiles)
    
    // Create previews for new files
    const newPreviews = [...additionalImagePreviews]
    files.forEach((file, index) => {
      if (newPreviews.length < 5) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string)
          setAdditionalImagePreviews([...newPreviews])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index))
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('item-images')
      .upload(path, file)
    
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('item-images')
      .getPublicUrl(path)
    
    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      if (!coverImage) {
        throw new Error('Cover image is required')
      }

      // Upload cover image
      const coverImagePath = `${user.id}/${Date.now()}-cover-${coverImage.name}`
      const coverImageUrl = await uploadImage(coverImage, coverImagePath)

      // Upload additional images
      const additionalImageUrls = []
      for (let i = 0; i < additionalImages.length; i++) {
        const imagePath = `${user.id}/${Date.now()}-additional-${i}-${additionalImages[i].name}`
        const imageUrl = await uploadImage(additionalImages[i], imagePath)
        additionalImageUrls.push(imageUrl)
      }

      // Insert item into database
      const { error: insertError } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          name: formData.name,
          type: formData.type,
          description: formData.description,
          cover_image: coverImageUrl,
          additional_images: additionalImageUrls,
        })

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({ name: '', type: '', description: '' })
      setCoverImage(null)
      setCoverImagePreview('')
      setAdditionalImages([])
      setAdditionalImagePreviews([])

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 p-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Upload className="w-8 h-8 mr-4" />
            Add New Item
          </h2>
          <p className="text-white/90 mt-3 text-lg">Fill in the details to add your item to the inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-3">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50"
                placeholder="Enter item name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-3">
                Item Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50"
                required
              >
                <option value="">Select item type</option>
                {ITEM_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 text-sm font-semibold mb-3">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none bg-gray-50/50"
              placeholder="Describe your item in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 text-sm font-semibold mb-3">
              Cover Image *
            </label>
            <div className="relative">
              <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 cursor-pointer group">
                {coverImagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover preview" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto shadow-lg"
                    />
                    <div className="flex items-center justify-center space-x-3">
                      <Check className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700 font-medium">{coverImage?.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium text-lg">Click to upload cover image</p>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 text-sm font-semibold mb-3">
              Additional Images (Optional - Max 5)
            </label>
            <div className="relative">
              <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300 cursor-pointer group">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-lg">Click to upload additional images</p>
                    <p className="text-gray-500 text-sm mt-1">Multiple files supported</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {additionalImagePreviews.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {additionalImagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Additional ${index + 1}`} 
                      className="w-full h-24 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                      {additionalImages[index]?.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-pulse">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center animate-bounce">
              <Check className="w-6 h-6 text-green-600 mr-3" />
              <p className="text-green-600 font-semibold text-lg">Item successfully added!</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 mr-3" />
                Add Item to Inventory
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}