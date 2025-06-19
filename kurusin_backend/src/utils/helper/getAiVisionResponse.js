const getAiVisionResponse = async (prompt, imageBase64, mimeType) => {
    const apiKey = process.env.GOOGLE_APIKEY;
    const model = 'gemini-pro-vision';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    if (!apiKey) {
        throw new Error("GOOGLE_API_KEY tidak ditemukan di .env");
    }

    const requestData = {
        contents: [{
            parts: [
                { text: prompt },
                {
                    inline_data: {
                        mime_type: mimeType,
                        data: imageBase64,
                    },
                },
            ],
        }],
    };

    try {
        const response = await axios.post(apiUrl, requestData);
        if (response.data.candidates && response.data.candidates.length > 0) {
            return response.data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("AI tidak memberikan respons yang valid.");
        }
    } catch (error) {
        console.error("Error saat menghubungi Gemini Vision API:", error.response ? JSON.stringify(error.response.data) : error.message);
        throw new Error("Gagal berkomunikasi dengan layanan AI Vision.");
    }
}

module.exports = getAiVisionResponse;