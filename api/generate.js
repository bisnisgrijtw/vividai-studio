export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, style } = req.body;
        const safePrompt = encodeURIComponent(prompt || 'portrait');
        const lighting = encodeURIComponent(style || 'Flat RAW Light');

        // Menghasilkan 4 URL gambar RAW instan berstandar tinggi
        const images = [
            `https://image.pollinations.ai/prompt/${safePrompt}%20${lighting}?width=512&height=640&seed=101&nologo=true`,
            `https://image.pollinations.ai/prompt/${safePrompt}%20${lighting}?width=512&height=640&seed=202&nologo=true`,
            `https://image.pollinations.ai/prompt/${safePrompt}%20${lighting}?width=512&height=640&seed=303&nologo=true`,
            `https://image.pollinations.ai/prompt/${safePrompt}%20${lighting}?width=512&height=640&seed=404&nologo=true`
        ];

        return res.status(200).json({ images });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
