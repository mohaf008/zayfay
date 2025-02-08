"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const colorOptions = ["red", "pink", "purple", "blue", "green", "yellow"]

export default function ThemeCustomizer({ currentTheme, onSave, onClose }) {
  const [primary, setPrimary] = useState(currentTheme.primary)
  const [secondary, setSecondary] = useState(currentTheme.secondary)

  const handleSave = () => {
    onSave({ primary, secondary })
    onClose()
  }

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
        className="bg-white rounded-lg p-8 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Customize Theme</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Primary Color</Label>
            <div className="flex space-x-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${color === primary ? "ring-2 ring-offset-2 ring-black" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setPrimary(color)}
                />
              ))}
            </div>
          </div>
          <div>
            <Label>Secondary Color</Label>
            <div className="flex space-x-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${color === secondary ? "ring-2 ring-offset-2 ring-black" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSecondary(color)}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Theme
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

