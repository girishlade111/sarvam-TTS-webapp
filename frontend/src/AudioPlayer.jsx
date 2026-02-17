import { useRef, useState, useEffect } from "react";

function AudioPlayer({ audioUrl }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      // Set the audio source
      audioRef.current.src = audioUrl;

      // When metadata is loaded, set the duration
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
        setCurrentTime(0); // Reset current time when new audio loads
      };

      // When audio ends, set isPlaying to false
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };

      // Cleanup function to revoke the object URL when component unmounts or audioUrl changes
      return () => {
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
      };
    }
  }, [audioUrl]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update current time as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle seeking through the audio
  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Rewind audio by 10 seconds
  const rewind = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  // Forward audio by 10 seconds
  const forward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  // Replay audio from the beginning
  const replay = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  // Format time for display (MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{
      marginTop: 30, background: "#1e1e1e", padding: 20, borderRadius: 10,
      display: "flex", flexDirection: "column", gap: 15, alignItems: "center"
    }}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata" // Preload metadata to get duration quicker
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={rewind}
          style={{
            padding: "8px 15px", borderRadius: 5, border: "none", background: "#333", color: "white", cursor: "pointer"
          }}
        >
          ⏪ 10s
        </button>
        <button
          onClick={togglePlay}
          style={{
            padding: "8px 15px", borderRadius: 5, border: "none", background: "#333", color: "white", cursor: "pointer"
          }}
        >
          {isPlaying ? "❚❚ Pause" : "▶ Play"}
        </button>
        <button
          onClick={forward}
          style={{
            padding: "8px 15px", borderRadius: 5, border: "none", background: "#333", color: "white", cursor: "pointer"
          }}
        >
          10s ⏩
        </button>
        <button
          onClick={replay}
          style={{
            padding: "8px 15px", borderRadius: 5, border: "none", background: "#333", color: "white", cursor: "pointer"
          }}
        >
          ⟳ Replay
        </button>
      </div>

      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        style={{ width: "80%", height: "5px", background: "#555", borderRadius: "5px", cursor: "pointer", WebkitAppearance: "none" }}
      />

      <div style={{ color: "#ccc", fontSize: 14 }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      <a href={audioUrl} download="tts-audio.mp3" style={{ textDecoration: "none" }}>
        <button
          style={{
            padding: "8px 15px", borderRadius: 5, border: "none", background: "#007bff", color: "white", cursor: "pointer"
          }}
        >
          Download Audio
        </button>
      </a>
    </div>
  );
}

export default AudioPlayer;