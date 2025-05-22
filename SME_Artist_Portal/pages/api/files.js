export default async function handler(req, res) {
  const { user } = req.query;
  const isAdmin = user.endsWith("@yourlabel.com");

  // In a real app, query a database or VPS storage API
  const allFiles = [
    { name: "DJ_Echo_Beat1.mp3", url: "https://vps.yourlabel.com/files/DJ_Echo_Beat1.mp3", uploader: "echo@artist.com" },
    { name: "MC_Nova_Vocals.wav", url: "https://vps.yourlabel.com/files/MC_Nova_Vocals.wav", uploader: "nova@artist.com" },
    { name: "Shadow_Synth_Track.mp3", url: "https://vps.yourlabel.com/files/Shadow_Synth_Track.mp3", uploader: "shadow@artist.com" }
  ];

  const visibleFiles = isAdmin ? allFiles : allFiles.filter(file => file.uploader === user);

  res.status(200).json(visibleFiles);
}