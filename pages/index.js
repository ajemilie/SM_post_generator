import { useState } from "react";

export default function Home() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [postText, setPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleUpload(e) {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
    setSelectedMedia(files[0]);
  }

  function handleRandom() {
    if (mediaFiles.length > 0) {
      const random = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];
      setSelectedMedia(random);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(`${postText}`);
    alert("Tekst kopieret til clipboard!");
  }

  async function generateAItext() {
    if (!selectedMedia || !selectedMedia.type.startsWith("image")) {
      alert("Vælg et billede for at bruge AI-generering.");
      return;
    }
    setLoading(true);
    // Læs billedet som base64
    const reader = new FileReader();
    reader.onload = async () => {
      const imageBase64 = reader.result;
      const response = await fetch('/api/generatePost', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 })
      });
      const data = await response.json();
      if (data.text) setPostText(data.text);
      else alert("Kunne ikke generere tekst.");
      setLoading(false);
    };
    reader.readAsDataURL(selectedMedia);
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif" }}>
      <h1>Social Media Post Generator 🌐</h1>

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleUpload}
      />

      <div style={{ margin: "20px 0" }}>
        <textarea
          rows={4}
          style={{ width: 300 }}
          placeholder="Skriv din post tekst her (du kan bruge emojis 😊🌟)..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
        <br />
        <button onClick={handleCopy} style={{ marginTop: 10 }}>Kopier tekst</button>
        <button
          onClick={generateAItext}
          style={{ marginLeft: 10 }}
          disabled={loading || !selectedMedia || !selectedMedia.type.startsWith("image")}
        >
          {loading ? "Genererer..." : "AI-generér tekst fra billede"}
        </button>
