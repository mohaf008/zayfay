"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Camera, Volume2, VolumeX, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import SpotifyIntegration from "@/components/spotify-integration"

const filters = [
  { name: "None", value: "none" },
  { name: "Sepia", value: "sepia(100%)" },
  { name: "Grayscale", value: "grayscale(100%)" },
  { name: "Invert", value: "invert(100%)" },
  { name: "Blur", value: "blur(5px)" },
  { name: "Hue Rotate", value: "hue-rotate(180deg)" },
]

const songs = [
  { name: "Romantic Ballad", src: "/music/romantic-ballad.mp3" },
  { name: "Upbeat Love", src: "/music/upbeat-love.mp3" },
  { name: "Soft Jazz", src: "/music/soft-jazz.mp3" },
]

export default function VirtualPhotoBooth({ onSave, onClose, theme }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const audioRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState("none")
  const [selectedSong, setSelectedSong] = useState(songs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(null)
  const [spotifyTrack, setSpotifyTrack] = useState(null)

  useEffect(() => {
    let mounted = true
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (mounted) {
          setStream(stream)
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        }
      } catch (err) {
        if (mounted) {
          console.error("Error accessing the camera", err)
          setError("Unable to access the camera. Please check your permissions and try again.")
        }
      }
    }
    setupCamera()
    return () => {
      mounted = false
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream]) // Added stream to dependencies

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video && canvas) {
      const context = canvas.getContext("2d")
      context.filter = selectedFilter
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageDataUrl = canvas.toDataURL("image/jpeg")
      setCapturedImage(imageDataUrl)
    }
  }

  const handleSave = () => {
    if (capturedImage) {
      onSave({
        image: capturedImage,
        caption: "Virtual Photo Booth Snapshot",
        date: new Date().toISOString().split("T")[0],
        category: "Milestones",
      })
      onClose()
    }
  }

  const toggleMusic = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause()
        } else {
          await audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
      } catch (error) {
        console.error("Error playing audio:", error)
        setError("Unable to play audio. Please try again or check your browser settings.")
      }
    }
  }

  const handleSongChange = async (value) => {
    const newSong = songs.find((song) => song.name === value)
    setSelectedSong(newSong)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.src = newSong.src
      try {
        await audioRef.current.load()
      } catch (error) {
        console.error("Error loading audio:", error)
        setError("Unable to load audio. Please try again or check your browser settings.")
      }
    }
  }

  const handleSpotifyTrackSelect = (track) => {
    setSpotifyTrack(track)
    if (audioRef.current) {
      audioRef.current.src = track.preview_url
      audioRef.current.load()
    }
  }

  if (error) {
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
          className="bg-white rounded-lg p-8 max-w-2xl w-full"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </motion.div>
      </motion.div>
    )
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
        className="bg-white rounded-lg p-8 max-w-2xl w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-semibold text-${theme.primary}-600`}>Virtual Photo Booth</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="space-y-4">
          {!capturedImage ? (
            <>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover rounded-lg"
                  style={{ filter: selectedFilter }}
                />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.map((filter) => (
                        <SelectItem key={filter.value} value={filter.value}>
                          {filter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <SpotifyIntegration onTrackSelect={handleSpotifyTrackSelect} />
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={capturePhoto}
                  className={`bg-${theme.primary}-500 hover:bg-${theme.primary}-600 flex-grow mr-2`}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Capture Photo
                </Button>
                <Button onClick={toggleMusic} variant="outline" className="flex-shrink-0">
                  {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>
            </>
          ) : (
            <>
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured"
                className="w-full h-64 object-cover rounded-lg"
                style={{ filter: selectedFilter }}
              />
              <div className="flex space-x-4">
                <Button onClick={() => setCapturedImage(null)} variant="outline" className="flex-1">
                  Retake
                </Button>
                <Button onClick={handleSave} className={`flex-1 bg-${theme.primary}-500 hover:bg-${theme.primary}-600`}>
                  Save Photo
                </Button>
              </div>
            </>
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} width={640} height={480} />
        <audio
          ref={audioRef}
          src={spotifyTrack ? spotifyTrack.preview_url : selectedSong.src}
          onError={(e) => {
            console.error("Audio playback error:", e)
            setError("Unable to play the selected track. Please try another.")
          }}
        />
      </motion.div>
    </motion.div>
  )
}

