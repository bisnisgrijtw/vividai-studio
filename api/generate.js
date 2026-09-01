export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Batas ukuran file gambar yang diupload
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
        const { prompt, images } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'GEMINI_API_KEY belum diset di Vercel.' });
        }

        // Menyusun bagian payload untuk dikirim ke Gemini (Teks + Gambar jika ada)
        let parts = [];

        // Jika pengguna mengupload gambar, ubah format Base64 agar dibaca oleh Gemini
        if (images && typeof images === 'object') {
            for (const [key, base64Str] of Object.entries(images)) {
                if (base64Str) {
                    const matches = base64Str.match(/^data:(.+);base64,(.+)$/);
                    if (matches && matches.length === 3) {
                        parts.push({
                            inlineData: {
                                mimeType: matches[1],
                                data: matches[2]
                            }
                        });
                    }
                }
            }
        }

        // Masukkan teks instruksi dari pengguna
        parts.push({ text: prompt });

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: parts }]
                })
            }
        );

        const data = await geminiResponse.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ result: aiText });
        } else {
            return res.status(500).json({ error: data.error?.message || 'Gagal memproses respon dari Gemini.' });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
