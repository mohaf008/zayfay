"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Slideshow({ memories, onClose, theme }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % memories.length)
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, memories.length])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-w-4xl w-full h-[80vh]"
      >
        <Button variant="ghost" onClick={onClose} className="absolute top-4 right-4 text-white">
          <X className="w-6 h-6" />
        </Button>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src={memories[currentIndex].image || "/placeholder.svg"}
              alt={memories[currentIndex].caption}
              width={800}
              height={600}
              className="object-contain max-w-full max-h-full"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          <h3 className="text-2xl font-semibold mb-2">{memories[currentIndex].caption}</h3>
          <p>{memories[currentIndex].date}</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-4 right-4 text-white"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
      </motion.div>
    </motion.div>
  )
}

