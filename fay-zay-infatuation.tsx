"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Grid, List, Music, Camera, Palette, MessageCircle, ThumbsUp } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Lightbox from "./lightbox"
import Timeline from "./timeline"
import PhotoEditor from "./photo-editor"
import Slideshow from "./slideshow"
import ThemeCustomizer from "./theme-customizer"
import VirtualPhotoBooth from "./virtual-photo-booth"
import Memorabilia from "./memorabilia"

// Mock data for initial memories
const initialMemories = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300",
    date: "2023-02-14",
    caption: "Our first Valentine's Day",
    category: "Milestones",
    likes: 5,
    comments: [],
    spotifyTrack: null,
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300",
    date: "2023-06-01",
    caption: "Summer picnic",
    category: "Dates",
    likes: 3,
    comments: [],
    spotifyTrack: null,
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300",
    date: "2023-12-25",
    caption: "Christmas morning",
    category: "Holidays",
    likes: 7,
    comments: [],
    spotifyTrack: null,
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300",
    date: "2024-01-01",
    caption: "New Year's kiss",
    category: "Milestones",
    likes: 10,
    comments: [],
    spotifyTrack: null,
  },
]

export default function FayZayInfatuation() {
  const [memories, setMemories] = useState(initialMemories)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [viewMode, setViewMode] = useState("grid")
  const [activeCategory, setActiveCategory] = useState("All")
  const [isEditing, setIsEditing] = useState(false)
  const [isSlideshowActive, setIsSlideshowActive] = useState(false)
  const [isCustomizingTheme, setIsCustomizingTheme] = useState(false)
  const [isVirtualPhotoBoothActive, setIsVirtualPhotoBoothActive] = useState(false)
  const [theme, setTheme] = useState({ primary: "pink", secondary: "purple" })

  const categories = ["All", "Milestones", "Dates", "Holidays"]

  const filteredMemories =
    activeCategory === "All" ? memories : memories.filter((memory) => memory.category === activeCategory)

  const handleUpload = (newMemory) => {
    setMemories([...memories, { ...newMemory, id: memories.length + 1, likes: 0, comments: [] }])
  }

  const handleLike = (id) => {
    setMemories(memories.map((memory) => (memory.id === id ? { ...memory, likes: memory.likes + 1 } : memory)))
  }

  const handleAddComment = (id, comment) => {
    setMemories(
      memories.map((memory) => (memory.id === id ? { ...memory, comments: [...memory.comments, comment] } : memory)),
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-${theme.secondary}-100 to-${theme.primary}-50 p-8`}>
      <header className="text-center mb-8">
        <h1 className={`text-5xl font-bold text-${theme.primary}-600 mb-2 font-serif`}>Fay & Zay Infatuation</h1>
        <p className={`text-${theme.secondary}-700 text-xl`}>Our love story, captured in moments</p>
      </header>

      <div className="flex justify-center space-x-4 mb-8">
        <Button onClick={() => setViewMode("grid")} variant={viewMode === "grid" ? "default" : "outline"}>
          <Grid className="w-5 h-5 mr-2" />
          Grid
        </Button>
        <Button onClick={() => setViewMode("timeline")} variant={viewMode === "timeline" ? "default" : "outline"}>
          <List className="w-5 h-5 mr-2" />
          Timeline
        </Button>
        <Button onClick={() => setIsSlideshowActive(true)}>
          <Music className="w-5 h-5 mr-2" />
          Slideshow
        </Button>
        <Button onClick={() => setIsVirtualPhotoBoothActive(true)}>
          <Camera className="w-5 h-5 mr-2" />
          Photo Booth
        </Button>
        <Button onClick={() => setIsCustomizingTheme(true)}>
          <Palette className="w-5 h-5 mr-2" />
          Customize
        </Button>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setActiveCategory(category)}
            variant={activeCategory === category ? "default" : "outline"}
          >
            {category}
          </Button>
        ))}
      </div>

      {viewMode === "grid" ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredMemories.map((memory) => (
            <motion.div
              key={memory.id}
              className={`relative overflow-hidden rounded-lg shadow-lg cursor-pointer bg-white`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMemory(memory)}
            >
              <Image
                src={memory.image || "/placeholder.svg"}
                alt={memory.caption}
                width={300}
                height={300}
                className="object-cover w-full h-64"
              />
              <div className={`absolute bottom-0 left-0 right-0 bg-${theme.primary}-500 bg-opacity-75 text-white p-2`}>
                <p className="font-semibold">{memory.caption}</p>
                <p className="text-sm">{memory.date}</p>
                <div className="flex items-center mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLike(memory.id)
                    }}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {memory.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {memory.comments.length}
                  </Button>
                  {memory.spotifyTrack && (
                    <Button variant="ghost" size="sm">
                      <Music className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Timeline
          memories={filteredMemories}
          onSelectMemory={setSelectedMemory}
          onLike={handleLike}
          onAddComment={handleAddComment}
          theme={theme}
        />
      )}

      <div className="mt-8 text-center">
        <Button
          onClick={() => setIsEditing(true)}
          className={`bg-${theme.primary}-500 hover:bg-${theme.primary}-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
        >
          <Heart className="w-5 h-5 mr-2" />
          Add a Memory
        </Button>
      </div>

      <AnimatePresence>
        {selectedMemory && (
          <Lightbox
            memory={selectedMemory}
            onClose={() => setSelectedMemory(null)}
            onLike={handleLike}
            onAddComment={handleAddComment}
            theme={theme}
          />
        )}
        {isEditing && <PhotoEditor onSave={handleUpload} onClose={() => setIsEditing(false)} theme={theme} />}
        {isSlideshowActive && (
          <Slideshow memories={memories} onClose={() => setIsSlideshowActive(false)} theme={theme} />
        )}
        {isCustomizingTheme && (
          <ThemeCustomizer currentTheme={theme} onSave={setTheme} onClose={() => setIsCustomizingTheme(false)} />
        )}
        {isVirtualPhotoBoothActive && (
          <VirtualPhotoBooth onSave={handleUpload} onClose={() => setIsVirtualPhotoBoothActive(false)} theme={theme} />
        )}
      </AnimatePresence>

      <Memorabilia theme={theme} />
    </div>
  )
}

