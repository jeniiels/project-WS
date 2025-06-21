const axios = require('axios');

const getAiResponse = async (prompt) => {
    const apiKey = process.env.GOOGLE_APIKEY;
    const model = 'gemini-2.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    if (!apiKey) {
        throw new Error("GOOGLE_API_KEY tidak ditemukan di .env");
    }
  
    const requestData = {
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ]
    };
  
    try {
        const response = await axios.post(apiUrl, requestData, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.data.candidates && response.data.candidates.length > 0) {
                return response.data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("AI tidak memberikan respons yang valid. Mungkin prompt Anda diblokir.");
        }
    } catch (error) {
        console.error("Error saat menghubungi Gemini API:", error.response ? JSON.stringify(error.response.data) : error.message);
        throw new Error("Gagal berkomunikasi dengan layanan AI.");
    }
}

module.exports = getAiResponse;