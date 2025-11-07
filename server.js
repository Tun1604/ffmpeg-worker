import express from "express";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());

app.post("/create-video", async (req, res) => {
  try {
    const { image, music, duration = 10 } = req.body;
    if (!image) return res.status(400).json({ error: "Missing image URL" });

    const id = uuidv4();
    const outputPath = `/tmp/${id}.mp4`;

    // Lệnh FFmpeg: tạo video từ ảnh + nhạc
    const cmd = music
      ? `ffmpeg -y -loop 1 -i "${image}" -i "${music}" -shortest -t ${duration} -vf "scale=1280:720,format=yuv420p" -pix_fmt yuv420p "${outputPath}"`
      : `ffmpeg -y -loop 1 -i "${image}" -t ${duration} -vf "scale=1280:720,format=yuv420p" -pix_fmt yuv420p "${outputPath}"`;

    exec(cmd, (error) => {
      if (error) return res.status(500).json({ error: error.message });

      res.download(outputPath, `${id}.mp4`, () => fs.unlinkSync(outputPath));
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (_, res) => res.send("FFmpeg worker is running ✅"));

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port 3000")
);
