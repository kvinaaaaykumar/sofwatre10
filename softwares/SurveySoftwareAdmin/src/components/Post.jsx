import React, { useState, useRef } from "react";

export default function Post() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedImageDataUrl, setSelectedImageDataUrl] = useState(null);
  const fileInputRef = useRef(null);
  const posterRef = useRef(null);
  
  

  // ✅ Default values
  const defaultImage =
    "data:image/jpeg;base64,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";
  const defaultName = "John Doe";
  const defaultAge = "25";

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setSelectedImageDataUrl(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImageDataUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !age || !selectedImageDataUrl) {
      alert("Please fill in all fields and upload an image.");
      return;
    }
  };

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous"; // for placeholder
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 500, 700);
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 640, 500, 60);

      ctx.fillStyle = "white";
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${name || defaultName} — Age ${age || defaultAge}`, 250, 680);

      const link = document.createElement("a");
      link.download = "poster.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = selectedImageDataUrl || defaultImage;
  };

  const handleReset = () => {
    setName("");
    setAge("");
    setSelectedImageDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="wrapper" style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit} autoComplete="off">
        <h2>Create Your Poster</h2>

        <div style={styles.row}>
          <label>Image (upload)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </div>

        <div style={styles.row}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={styles.row}>
          <label>Age</label>
          <select value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">Select age</option>
            {Array.from({ length: 100 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* ✅ Always show example poster */}
      <div style={{ display: "block" }}>
        <div style={styles.poster} ref={posterRef}>
          <img
            src={selectedImageDataUrl || defaultImage}
            alt="Poster"
            style={{ width: "100%", display: "block" }}
          />
          <div style={styles.posterText}>
            {name || defaultName} — Age {age || defaultAge}
          </div>
        </div>
      </div>

      <button onClick={handleDownload}>Download PNG</button>
    </div>
  );
}

const styles = {
  wrapper: {
    fontFamily: "system-ui, sans-serif",
    background: "linear-gradient(180deg,#071029 0%, #071a2a 100%)",
    minHeight: "100vh",
    padding: "20px",
    color: "#e6eef6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  card: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
    borderRadius: "12px",
    padding: "20px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 30px rgba(2,6,23,0.6)",
    border: "1px solid rgba(255,255,255,0.04)",
  },
  row: {
    marginBottom: "14px",
  },
  poster: {
    position: "relative",
    width: "300px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
    textAlign: "center",
  },
  posterText: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
    color: "white",
    padding: "12px",
    fontSize: "18px",
    fontWeight: "bold",
  },
};
