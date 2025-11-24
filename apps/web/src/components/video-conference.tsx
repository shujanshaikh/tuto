"use client"

import React, { useState } from "react"
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  useTracks,
  useDataChannel,
} from "@livekit/components-react"
import { Track } from "livekit-client"

interface Message {
  from: string
  text: string
  timestamp?: Date
}

interface VideoConferenceProps {
  handleSend: () => void
  message: string
  setMessage: (message: string) => void
  messages: Message[]
  status: string
}

export default function MyVideoConference({ handleSend, message, setMessage, messages, status }: VideoConferenceProps) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  )


  const [transcripts, setTranscripts] = useState<string[]>([])

  const onDataReceived = React.useCallback((msg: any) => {
    try {
      if (msg?.topic === "transcription" && msg?.payload) {
        const decodedText = new TextDecoder("utf-8").decode(msg.payload)
        try {
          const parsed = JSON.parse(decodedText)
          const text = typeof parsed === "string" ? parsed : (parsed?.text ?? decodedText)
          setTranscripts((prev) => [...prev, String(text)])
        } catch {
          setTranscripts((prev) => [...prev, decodedText])
        }
      }
    } catch {
      console.error("Malformed data channel message")
    }
  }, [])

  useDataChannel(onDataReceived)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full bg-background text-foreground overflow-hidden">
      <div className="flex-1 flex flex-col bg-background relative">
        <div className="relative flex-1 p-0">
          <GridLayout
            tracks={tracks}
            style={{ height: "calc(100% - 80px)" }}
            className="relative z-10 h-full overflow-hidden"
          >
            <ParticipantTile className="border border-border bg-card" />
          </GridLayout>
        </div>

        <div className="relative border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="relative z-10">
            <ControlBar />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-0 border-t lg:border-t-0 lg:border-l border-border bg-card h-1/2 lg:h-full">
        <div className="px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-xs font-medium text-muted-foreground">
              {status}
            </span>
          </div>
        </div>


        {transcripts.length > 0 && (
          <div className="border-b border-border p-3 bg-muted/50 overflow-y-auto max-h-40">
            <div className="text-xs text-muted-foreground font-medium mb-2">Transcripts</div>
            <ul className="space-y-1">
              {transcripts.map((t, i) => (
                <li key={i} className="text-foreground text-xs lg:text-sm break-words">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex-1 p-3 bg-card overflow-y-auto min-h-0">
          {messages.length === 0 ? (
            <div className="text-muted-foreground text-sm text-center mt-4">No messages yet</div>
          ) : (
            <ul className="space-y-2">
              {messages.map((m, i) => (
                <li
                  key={i}
                  className={`flex flex-col gap-1 p-2 rounded-lg text-sm ${m.from === "me" ? "bg-accent text-accent-foreground" : "bg-muted/50 border border-border"
                    }`}
                >
                  <strong className="text-muted-foreground text-xs">{m.from}</strong>
                  <span className="text-foreground break-words">{m.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-3 border-t border-border bg-card">
          <div className="flex flex-col gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${message.trim()
                ? "bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}