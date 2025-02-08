"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ThumbsUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Timeline({ memories, onSelectMemory, onLike, onAddComment, theme }) {
  const [newComment, setNewComment] = useState("")

  return (
    <div className="max-w-4xl mx-auto">
      {memories.map((memory, index) => (
        <motion.div
          key={memory.id}
          className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-center mb-8`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="w-1/2 px-4">
            <motion.div
              className="rounded-lg overflow-hidden shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectMemory(memory)}
            >
              <Image
                src={memory.image || "/placeholder.svg"}
                alt={memory.caption}
                width={400}
                height={300}
                className="object-cover w-full h-48"
              />
            </motion.div>
          </div>
          <div className={`w-1/2 px-4 ${index % 2 === 0 ? "text-left" : "text-right"}`}>
            <h3 className={`text-xl font-semibold text-${theme.primary}-600 mb-2`}>{memory.caption}</h3>
            <p className={`text-${theme.secondary}-700 mb-2`}>{memory.date}</p>
            <div className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"} items-center mb-2`}>
              <Button variant="ghost" size="sm" onClick={() => onLike(memory.id)}>
                <ThumbsUp className="w-4 h-4 mr-1" />
                {memory.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-1" />
                {memory.comments.length}
              </Button>
            </div>
            <div className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-center`}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border rounded px-2 py-1 mr-2 flex-grow"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (newComment.trim()) {
                    onAddComment(memory.id, newComment.trim())
                    setNewComment("")
                  }
                }}
              >
                Post
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

