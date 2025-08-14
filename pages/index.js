import { useState } from "react";

export default function Home() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [postText, setPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);

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
      </div>

      <div>
        <button onClick={handleRandom} disabled={mediaFiles.length === 0}>
          Vælg tilfældigt billede/video
        </button>
      </div>

      {selectedMedia && (
        <div style={{ marginTop: 20 }}>
          <h3>Preview:</h3>
          {selectedMedia.type.startsWith("image") ? (
            <img
              src={URL.createObjectURL(selectedMedia)}
              alt="preview"
              style={{ maxWidth: 400, borderRadius: 12 }}
            />
          ) : (
            <video
              controls
              style={{ maxWidth: 400, borderRadius: 12 }}
              src={URL.createObjectURL(selectedMedia)}
            />
          )}
          <p style={{ maxWidth: 400 }}>{postText}</p>
        </div>
      )}
    </div>
  );
}
