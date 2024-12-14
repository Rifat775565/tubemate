const ytdl = require('ytdl-core');

export default async function handler(req, res) {
    const videoUrl = req.query.url;

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).send('Invalid YouTube URL');
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9 \\-_]/g, '');

        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(videoUrl, { format: 'mp4' }).pipe(res);
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).send('Failed to download video');
    }
}
