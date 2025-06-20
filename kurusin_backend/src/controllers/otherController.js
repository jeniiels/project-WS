const fs = require('fs');
const getAiResponse = require("../utils/helper/getAiResponse");
const getAiVisionResponse = require("../utils/helper/getAiVisionResponse");
const getTodayDateString = require("../utils/helper/getTodayDateString");
const { Exercise, FoodHistory, WorkoutHistory } = require('../models');
const { default: axios } = require('axios');

// GET /api/diary
const getDiary = async (req, res) => {
    
};

// POST /api/scan
const scan = async (req, res) => {
    // Dapatkan path file yang diunggah oleh multer
    const imagePath = req.file ? req.file.path : null;

    try {
        // 1. Validasi: Pastikan file gambar telah diunggah
        if (!req.file) {
            return res.status(400).json({ message: "File gambar tidak ditemukan. Pastikan Anda mengirimnya dengan key 'imageFile'." });
        }

        // 2. Baca file gambar dan konversi ke Base64
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
        const mimeType = req.file.mimetype; // Dapatkan tipe MIME dari multer

        // 3. Buat prompt yang sangat spesifik untuk AI
        const prompt = `
            Anda adalah ahli gizi dan analis makanan. Analisis gambar makanan ini dan berikan jawaban HANYA dalam format JSON yang bisa di-parse.
            Jangan gunakan markdown backticks (\`\`\`json) atau teks penjelasan lain di luar JSON.

            Tugas Anda:
            1. Identifikasi nama makanan utama dalam gambar.
            2. Berikan "confidence" score (antara 0.0 hingga 1.0) tentang seberapa yakin Anda dengan identifikasi tersebut.
            3. Prediksikan informasi nutrisi (kalori, protein, karbohidrat, lemak) untuk satu porsi standar makanan tersebut.

            Struktur JSON harus persis seperti ini:
            {
              "nama_makanan": "NAMA_MAKANAN",
              "confidence": 0.9,
              "nutrisi_prediksi": {
                "kalori": 350,
                "protein": 8,
                "karbohidrat": 50,
                "lemak": 10
              }
            }
        `;

        const aiResponseText = await geminiService.getAiVisionResponse(prompt, imageBase64, mimeType);

        let foodInfo;
        try {
            const cleanResponse = aiResponseText.replace(/```json/g, '').replace(/```/g, '');
            foodInfo = JSON.parse(cleanResponse.trim());
        } catch (parseError) {
            console.error("Gagal mem-parsing JSON dari AI. Respons mentah:", aiResponseText);
            return res.status(500).json({ message: "Gagal memproses respons dari AI.", rawResponse: aiResponseText });
        }

        res.status(200).json(foodInfo);

    } catch (error) {
        console.error("Error di fetchCalory:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server.", error: error.message });
    } finally {
        // 7. (PENTING) Selalu hapus file sementara setelah selesai
        if (imagePath) {
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Gagal menghapus file sementara:", imagePath, err);
            });
        }
    }
};

// GET /api/fetch
const fetchExercise = async (req, res) => {
    let options = {
        method: 'GET',
        url: `https://exercisedb.p.rapidapi.com/exercises`,
        params: {
            limit: '100',
            offset: '0'
        },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_APIKEY,
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
    };

    try {
		const response = await axios.request(options);
        const result = response.data.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            equipment: exercise.equipment,
            muscles: [exercise.target, ...(exercise.secondaryMuscles || [])],
            img: exercise.gifUrl || ""
        }));

        await Exercise.insertMany(result);
        return res.status(200).json(result);
	} catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
	}
};

// GET /api/recommendation
const fetchRecommendation = async (req, res) => {
    try {
        const tanggal = getTodayDateString();
        const todayHistory = await FoodHistory.findOne({ username: req.user.username, tanggal });

        let dataKonstektual;
        if (todayHistory && todayHistory.foods.length > 0) {
            const foodNames = todayHistory.foods.map(f => f.name).join(', ');
            dataKonstektual = `Pengguna hari ini sudah makan: ${foodNames}. Total kalori sejauh ini: ${todayHistory.summary.kalori} kkal.`;
        } else {
            dataKonstektual = "Pengguna belum makan apa-apa hari ini. Sarankan menu untuk sarapan.";
        }

        const prompt = `
            Anda adalah seorang ahli gizi.
            Tugas Anda adalah memberikan SATU rekomendasi makanan sehat berikutnya untuk pengguna.
            
            Konteks: ${dataKonstektual}

            Tolong berikan jawaban HANYA dalam format JSON yang bisa di-parse, tanpa teks pembuka, penutup, atau penjelasan lain.
            Jangan gunakan markdown backticks (\`\`\`json).
            Struktur JSON harus seperti ini:
            {
              "nama_makanan": "NAMA_MAKANAN_YANG_DIREKOMENDASIKAN",
              "nutrisi_prediksi": {
                "kalori": JUMLAH_KALORI,
                "protein": JUMLAH_PROTEIN,
                "karbohidrat": JUMLAH_KARBOHIDRAT,
                "lemak": JUMLAH_LEMAK
              }
            }
        `;

        const aiResponseText = await getAiResponse(prompt);

        let recommendation;
        try {
            recommendation = JSON.parse(aiResponseText.trim());
        } catch (parseError) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }

        res.status(200).json(recommendation);

    } catch (err) {
        console.error("Error di fetchRecommendation:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server.", error: error.message });
    }
};

const calculateCalory = async (req, res) => {
    try {
        const tanggal = getTodayDateString(); // Misalnya: '2025-06-19'
        const id_user = req.user.username || req.user.id_user;

        // Ambil data makanan hari ini
        const todayFood = await FoodHistory.findOne({ id_user, tanggal });

        // Kalori masuk (makanan)
        const kaloriMasuk = todayFood?.summary?.kalori || 0;

        // Ambil semua workout hari ini (filter berdasarkan tanggal)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const workouts = await WorkoutHistory.find({
            id_user,
            timestamp: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        // Total kalori keluar (misalnya best_set_volume * 0.1 sebagai faktor pembakar kalori)
        const kaloriKeluar = workouts.reduce((total, w) => {
            return total + (w.best_set_volume || 0) * 0.1;
        }, 0);

        return res.status(200).json({
            tanggal,
            kaloriMasuk,
            kaloriKeluar: Math.round(kaloriKeluar) // dibulatkan ke kalori
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getDiary,
    scan,
    fetchExercise,
    fetchRecommendation,
    calculateCalory
};