"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SpotifyIntegration({ onTrackSelect }) {
  const [accessToken, setAccessToken] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if there's an access token in the URL (after Spotify auth redirect)
    const hash = window.location.hash
    if (hash) {
      const token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1]
      setAccessToken(token)
      setIsAuthorized(true)
      // Clear the hash from the URL
      window.location.hash = ""
    }
  }, [])

  const handleAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const redirectUri = encodeURIComponent(window.location.origin)
    const scope = encodeURIComponent("user-read-private user-read-email user-library-read")
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}`
    window.location.href = spotifyAuthUrl
  }

  const handleSearch = async () => {
    if (!searchQuery) return

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch search results")
      }

      const data = await response.json()
      setSearchResults(data.tracks.items)
    } catch (error) {
      console.error("Error searching Spotify:", error)
    }
  }

  return (
    <div className="space-y-4">
      {!isAuthorized ? (
        <Button onClick={handleAuth}>Connect Spotify</Button>
      ) : (
        <>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a song"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <div className="space-y-2">
            {searchResults.map((track) => (
              <div key={track.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{track.name}</p>
                  <p className="text-sm text-gray-500">{track.artists.map((artist) => artist.name).join(", ")}</p>
                </div>
                <Button onClick={() => onTrackSelect(track)}>Select</Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

