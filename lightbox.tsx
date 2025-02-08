"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { X, ThumbsUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LightboxProps {
  memory: any
  onClose: () => void
  onLike: (id: number) => void
  onAddComment: (id: number, comment: string) => void
  theme: { primary: string; secondary: string }
}

export default function Lightbox({ memory, onClose, onLike, onAddComment, theme }: LightboxProps) {
  const [newComment, setNewComment] = useState("")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-w-3xl w-full bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={memory.image || "/placeholder.svg"}
          alt={memory.caption}
          width={800}
          height={600}
          className="object-contain w-full h-[60vh]"
        />
        <div className="p-4">
          <h2 className={`text-2xl font-semibold text-${theme.primary}-600 mb-2`}>{memory.caption}</h2>
          <p className={`text-${theme.secondary}-700 mb-4`}>{memory.date}</p>
          <div className="flex items-center mb-4">
            <Button variant="ghost" onClick={() => onLike(memory.id)}>
              <ThumbsUp className="w-5 h-5 mr-2" />
              {memory.likes}
            </Button>
            <Button variant="ghost">
              <MessageCircle className="w-5 h-5 mr-2" />
              {memory.comments.length}
            </Button>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={`border rounded px-2 py-1 mr-2 flex-grow border-${theme.primary}-300 focus:outline-none focus:ring-2 focus:ring-${theme.primary}-500`}
            />
            <Button
              onClick={() => {
                if (newComment.trim()) {
                  onAddComment(memory.id, newComment.trim())
                  setNewComment("")
                }
              }}
              className={`bg-${theme.primary}-500 hover:bg-${theme.primary}-600 text-white`}
            >
              Post
            </Button>
          </div>
          <div className="mt-4 max-h-40 overflow-y-auto">
            {memory.comments.map((comment, index) => (
              <p key={index} className={`text-${theme.secondary}-600 mb-2`}>
                {comment}
              </p>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-white bg-${theme.primary}-500 rounded-full p-2 hover:bg-${theme.primary}-600 transition-colors duration-300`}
        >
          <X className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  )
}

