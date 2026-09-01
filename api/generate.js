export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { prompt, style } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY belum diatur.' });

        const systemInstruction = `Bertindaklah sebagai AI Creator Suite profesional. Buat 4 varian Master Prompt fotografi profesional dalam bahasa Inggris yang sangat detail berdasarkan instruksi: "${prompt}" dengan gaya pencahayaan "${style || 'Flat RAW Light'}". Berikan hasil yang bersih, terstruktur, dan siap pakai untuk generator gambar profesional.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: systemInstruction }] }] })
            }
        );

        const data = await response.json();
        const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Gagal memproses AI.';

        return res.status(200).json({ result: textResult });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
