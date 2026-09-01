export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

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

        // Menggunakan engine visual publik berkecepatan tinggi yang merender gambar secara instan
        // Berdasarkan prompt dan gaya pencahayaan RAW yang dipilih
        const enhancedPrompt = `${prompt}, cinematic photography, ${style || 'Flat RAW Light'}, uncompressed, photorealistic, 8k resolution, highly detailed`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);

        // Membuat 4 varian URL gambar unik menggunakan seed yang berbeda
        const imageUrls = [
            `https://pollinations.ai/p/${encodedPrompt}?width=512&height=640&seed=101&nologo=true`,
            `https://pollinations.ai/p/${encodedPrompt}?width=512&height=640&seed=202&nologo=true`,
            `https://pollinations.ai/p/${encodedPrompt}?width=512&height=640&seed=303&nologo=true`,
            `https://pollinations.ai/p/${encodedPrompt}?width=512&height=640&seed=404&nologo=true`
        ];

        return res.status(200).json({ images: imageUrls });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
