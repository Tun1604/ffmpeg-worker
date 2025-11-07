import express from "express";
import cors from "cors";
import { exec } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Route kiểm tra server
app.get("/", (req, res) => {
  res.send("FFmpeg worker is running ✅");
});

// ✅ Route chính để tạo video
app.post("/create-video", async (req, res) => {
  const { image, music, duration } = req.body;
  if (!image || !music) {
    return res.status(400).json({ error: "Missing image or music URL" });
  }

  try {
    const cmd = `ffmpeg -loop 1 -i "${image}" -i "${music}" -t ${
      duration || 5
    } -vf "scale=1280:720" -pix_fmt yuv420p -c:v libx264 -shortest output.mp4`;

    exec(cmd, (error) => {
      if (error) {
        console.error("FFmpeg error:", error);
        res.status(500).json({ error: "FFmpeg failed" });
      } else {
        res.json({ message: "Render started", status: "processing" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
