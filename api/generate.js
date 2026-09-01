export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, style } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
        }

        const cleanPrompt = encodeURIComponent(`${prompt}, ${style || 'Flat RAW Light'}, photorealistic, 8k, highly detailed`);

        const imageUrls = [
            `https://image.pollinations.ai/prompt/${cleanPrompt}?width=512&height=640&seed=111&nologo=true`,
            `https://image.pollinations.ai/prompt/${cleanPrompt}?width=512&height=640&seed=222&nologo=true`,
            `https://image.pollinations.ai/prompt/${cleanPrompt}?width=512&height=640&seed=333&nologo=true`,
            `https://image.pollinations.ai/prompt/${cleanPrompt}?width=512&height=640&seed=444&nologo=true`
        ];

        return res.status(200).json({ images: imageUrls });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
