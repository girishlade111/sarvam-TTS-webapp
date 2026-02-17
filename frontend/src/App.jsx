import { useState, useRef } from "react";
import AudioPlayer from './AudioPlayer'; // Import the new AudioPlayer component

// Structured speaker list grouped by gender
const speakers = {
  Male: [
    "Rahul", "Ratan", "Shubh", "Amit", "Sumit", "Manan",
    "Aditya", "Ashutosh", "Advait", "Gokul", "Kabir",
    "Varun", "Mani", "Mohit", "Rohan", "Dev", "Sunny",
    "Aayan", "Anand", "Tarun", "Vijay", "Rehan", "Soham"
  ],
  Female: [
    "Kavya", "Priya", "Ishita", "Shreya", "Shruti", "Ritu",
    "Pooja", "Simran", "Roopa", "Tanya", "Suhani",
    "Kavitha", "Neha", "Rupali"
  ]
};

// Centralized language mapping config
const languages = {
  English: "en-IN",
  Hindi: "hi-IN",
  Bengali: "bn-IN",
  Gujarati: "gu-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
  Marathi: "mr-IN",
  Odia: "or-IN",
  Punjabi: "pa-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN"
};

function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("hi-IN");
  const [speaker, setSpeaker] = useState("shubh"); // Default speaker
  const [pace, setPace] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [playingPreviewSpeaker, setPlayingPreviewSpeaker] = useState(null);


  // Helper to get language display name from its code
  const getLanguageLabel = (code) => {
    const entry = Object.entries(languages).find(([key, value]) => value === code);
    return entry ? entry[0] : code;
  };

  const showToast = (message, type = "error") => {
    setError(message);
    setTimeout(() => setError(null), 5000); // Clear after 5 seconds
  };

  const generateSpeech = async () => {
    setLoading(true);
    setAudioUrl(null);
    setError(null);

    if (!text.trim()) {
      showToast("Text cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          target_language_code: language,
          speaker: speaker.toLowerCase(),
          model: "bulbul:v3",
          pace,
          speech_sample_rate: 22050,
          output_audio_codec: "mp3",
          enable_preprocessing: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.details || errorData.error || "Failed to generate speech.");
      }

      const blob = await response.blob();
      const newAudioUrl = URL.createObjectURL(blob);
      setAudioUrl(newAudioUrl);

    } catch (err) {
      showToast(err.message);
      console.error("Error generating speech:", err);
    } finally {
      setLoading(false);
    }
  };

  const playPreview = async (previewSpeaker) => {
    setPreviewLoading(true);
    setPlayingPreviewSpeaker(previewSpeaker);
    setError(null);

    try {
      const previewText = `Hello, this is ${previewSpeaker}.`;
      const response = await fetch("http://localhost:5000/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: previewText,
          target_language_code: language,
          speaker: previewSpeaker.toLowerCase(),
          model: "bulbul:v3",
          pace: 1.0, // Default pace for preview
          speech_sample_rate: 22050,
          output_audio_codec: "mp3",
          enable_preprocessing: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.details || errorData.error || "Failed to play preview.");
      }

      const blob = await response.blob();
      const newAudioUrl = URL.createObjectURL(blob);
      const audio = new Audio(newAudioUrl);
      audio.play();

    } catch (err) {
      showToast(`Preview Error: ${err.message}`);
      console.error("Error playing preview:", err);
    } finally {
      setPreviewLoading(false);
      setPlayingPreviewSpeaker(null);
    }
  };



  return (
    <div style={{
      maxWidth: 800, margin: "0 auto", padding: 40, fontFamily: "Segoe UI, sans-serif",
      backgroundColor: "#1a1a1a", color: "white", minHeight: "100vh", borderRadius: 8, boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: 40, color: "#4CAF50" }}>Sarvam AI TTS App</h1>

      <div style={{ marginBottom: 20 }}>
        <textarea
          rows="6"
          placeholder="Enter text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%", padding: 15, borderRadius: 8, border: "1px solid #444",
            backgroundColor: "#2a2a2a", color: "white", fontSize: 16, resize: "vertical"
          }}
        />
      </div>

      <div style={{ marginBottom: 30, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <label style={{ color: "#bbb" }}>
          Language: {getLanguageLabel(language)}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ marginLeft: 10, padding: 10, borderRadius: 8, border: "1px solid #444", backgroundColor: "#2a2a2a", color: "white" }}
          >
            {Object.keys(languages).map((lang) => (
              <option key={lang} value={languages[lang]}>
                {lang}
              </option>
            ))}
          </select>
        </label>

        <label style={{ color: "#bbb" }}>
          Speaker:
          <select
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            style={{ marginLeft: 10, padding: 10, borderRadius: 8, border: "1px solid #444", backgroundColor: "#2a2a2a", color: "white" }}
          >
            {Object.keys(speakers).map((gender) => (
              <optgroup key={gender} label={gender}>
                {speakers[gender].map((name) => (
                  <option key={name} value={name.toLowerCase()}>
                    {name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        {/* Play Preview Button for selected speaker */}
        <button
          onClick={() => playPreview(speaker)}
          disabled={previewLoading}
          style={{
            padding: "8px 12px",
            fontSize: 14,
            borderRadius: 5,
            border: "none",
            backgroundColor: previewLoading && playingPreviewSpeaker === speaker ? "#ffc107" : "#17a2b8",
            color: "white",
            cursor: previewLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5
          }}
          title={`Preview voice of ${speaker}`}
        >
          {previewLoading && playingPreviewSpeaker === speaker ? (
            <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
          ) : (
            <span>&#9658; Preview</span> // Play icon
          )}
        </button>

        <label style={{ color: "#bbb" }}>
          Pace:
          <input
            type="number"
            step="0.1"
            value={pace}
            onChange={(e) => setPace(parseFloat(e.target.value))}
            style={{ marginLeft: 10, padding: 10, borderRadius: 8, border: "1px solid #444", backgroundColor: "#2a2a2a", color: "white", width: 70 }}
          />
        </label>
      </div>

      {audioUrl && <AudioPlayer audioUrl={audioUrl} />}

      {error && (
        <div style={{
          backgroundColor: "#f44336", color: "white", padding: 10, borderRadius: 5, marginBottom: 20, textAlign: "center"
        }}>
          {error}
        </div>
      )}
      {/* Basic spinner CSS */}
      <style>{`
        .spinner {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
