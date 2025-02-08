"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function PhotoEditor({ onSave, onClose, theme }) {
  const [image, setImage] = useState(null)
  const [caption, setCaption] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("Milestones")
  const [filter, setFilter] = useState("none")

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    onSave({ image, caption, date, category, filter })
    onClose()
  }

  const filters = ["none", "grayscale", "sepia", "blur", "brightness", "contrast"]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className={`bg-white rounded-lg p-8 max-w-md w-full`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-semibold text-${theme.primary}-600`}>Add a Memory</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="image">Upload Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          {image && (
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt="Preview"
                className={`object-cover w-full h-full filter-${filter}`}
              />
            </div>
          )}
          <div>
            <Label htmlFor="filter">Apply Filter</Label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`w-full p-2 border rounded-md border-${theme.primary}-300 focus:outline-none focus:ring-2 focus:ring-${theme.primary}-500`}
            >
              {filters.map((f) => (
                <option key={f} value={f}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe this beautiful moment..."
              className={`border-${theme.primary}-300 focus:ring-${theme.primary}-500`}
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`border-${theme.primary}-300 focus:ring-${theme.primary}-500`}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full p-2 border rounded-md border-${theme.primary}-300 focus:outline-none focus:ring-2 focus:ring-${theme.primary}-500`}
            >
              <option value="Milestones">Milestones</option>
              <option value="Dates">Dates</option>
              <option value="Holidays">Holidays</option>
            </select>
          </div>
          <Button
            onClick={handleSave}
            className={`w-full bg-${theme.primary}-500 hover:bg-${theme.primary}-600 text-white`}
          >
            Save Memory
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

