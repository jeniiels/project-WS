const fs = require("fs");
const getAiResponse = require("../utils/helper/getAiResponse");
const getAiVisionResponse = require("../utils/helper/getAiVisionResponse");
const getTodayDateString = require("../utils/helper/getTodayDateString");
const { Exercise, Workout, FoodHistory, WorkoutHistory } = require("../models");
const { default: axios } = require("axios");
const createWorkoutSchema = require("../utils/joi/createWorkoutSchema");
const generateWorkoutId = require("../utils/helper/generateWorkoutId");
const calculateHeaviestSet = require("../utils/helper/calculateHeaviestSet");
const calculateBestVolume = require("../utils/helper/calculateBestVolume");
const calculateDuration = require("../utils/helper/calculateDuration");
const isSameExercises = require("../utils/helper/isSameExercises");

// GET /api/diary
const getDiary = async (req, res) => {
    const { username } = req.params;
    const { tanggal } = req.query;

    try {
        if (tanggal) {
            const data = await FoodHistory.findOne({ username, tanggal }).select('-createdAt -updatedAt');
            if (!data) return res.status(404).json({ message: "Data food history tidak ditemukan." });
            return res.status(200).json(data);
        } else {
            const data = await FoodHistory.find({ username }).sort({ tanggal: -1 }).select('-createdAt -updatedAt');
            if (!data || data.length === 0) return res.status(404).json({ message: "Tidak ada riwayat food history untuk user ini." });
            return res.status(200).json(data);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// POST /api/scan
const scan = async (req, res) => {
  const imagePath = req.file ? req.file.path : null;

  try {
    if (!req.file) return res.status(400).json({ message: "File gambar tidak ditemukan. Pastikan Anda mengirimnya dengan key 'imageFile'." });

    const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
    const mimeType = req.file.mimetype;

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

    const aiResponseText = await getAiVisionResponse(
        prompt,
        imageBase64,
        mimeType
    );

    let foodInfo;
    try {
        const cleanResponse = aiResponseText
            .replace(/```json/g, "")
            .replace(/```/g, "");
        foodInfo = JSON.parse(cleanResponse.trim());
        } catch (parseError) {
            console.error("Gagal mem-parsing JSON dari AI. Respons mentah:", aiResponseText);
            return res.status(500).json({
                message: "Gagal memproses respons dari AI.",
                rawResponse: aiResponseText,
            });
        }

        const tanggal = getTodayDateString();
        const existingHistory = await FoodHistory.findOne({ username: req.user.username, tanggal });
        if (existingHistory) {
            const id = existingHistory.foods.length > 0 ? existingHistory.foods[existingHistory.foods.length - 1].id + 1 : 1;
            existingHistory.foods.push({
                id,
                name: foodInfo.nama_makanan,
                jumlah: 1,
                tipe_sajian: "g",
                kalori_total: foodInfo.nutrisi_prediksi.kalori,
            });
            existingHistory.summary.kalori += foodInfo.nutrisi_prediksi.kalori;
            existingHistory.summary.protein += foodInfo.nutrisi_prediksi.protein;
            existingHistory.summary.karbohidrat += foodInfo.nutrisi_prediksi.karbohidrat;
            existingHistory.summary.lemak += foodInfo.nutrisi_prediksi.lemak;
            await existingHistory.save();
        } else {
            const newFoodHistory = new FoodHistory({
                username: req.user.username,
                tanggal,
                foods: [{
                    id: 1,
                    name: foodInfo.nama_makanan,
                    jumlah: 1,
                    tipe_sajian: "g",
                    kalori_total: foodInfo.nutrisi_prediksi.kalori
                }],
                summary: {
                    kalori: foodInfo.nutrisi_prediksi.kalori,
                    protein: foodInfo.nutrisi_prediksi.protein,
                    karbohidrat: foodInfo.nutrisi_prediksi.karbohidrat,
                    lemak: foodInfo.nutrisi_prediksi.lemak
                }
            });
            await newFoodHistory.save();
        }

        return res.status(200).json(foodInfo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    } finally {
        // hapus file sementara setelah selesai
        if (imagePath) {
        fs.unlink(imagePath, (err) => {
            if (err)
            console.error("Gagal menghapus file sementara:", imagePath, err);
        });
        }
    }
};

// POST /api/perform
const perform = async (req, res) => {
    try {
        const { username, time, duration } = req.body;
        const workoutData = { exercises: req.body.exercises };
        let id_workout = "";
        let kalori = 0;

        const idList = workoutData.exercises.map(e => e.id_exercise);
        const exerciseDetails = await Exercise.find({ id: { $in: idList } }).lean();
        const fullData = {
            username,
            time,
            duration,
            exercises: workoutData.exercises.map(ex => {
                const detail = exerciseDetails.find(d => d.id === ex.id_exercise);
                return {
                    id_exercise: ex.id_exercise,
                    name: detail?.name || "Unknown",
                    equipment: detail?.equipment || "Unknown",
                    muscles: detail?.muscles || [],
                    sets: ex.sets
                };
            })
        };

        const prompt = `
            Anda adalah seorang ahli fisiologi olahraga dan pakar kebugaran.
            Tugas Anda adalah menghitung estimasi total kalori yang terbakar dari data sesi latihan berikut.

            Data Sesi Latihan:
            ${JSON.stringify(fullData, null, 2)}

            Analisis semua informasi yang diberikan: durasi total, jenis latihan, target otot, dan detail setiap set (beban dan repetisi).
            
            INSTRUKSI PENTING UNTUK OUTPUT:
            Balasan Anda HARUS HANYA berupa satu angka integer saja.
            - JANGAN sertakan teks penjelasan apa pun.
            - JANGAN sertakan satuan seperti "kalori" atau "kcal".
            - JANGAN format sebagai JSON.
            - Cukup angka estimasi kalori yang terbakar.

            Contoh balasan yang valid: 412
            Contoh balasan yang TIDAK valid: "Sekitar 412 kalori."
        `;

        const aiResponseText = await getAiResponse(prompt);
        kalori = parseInt(aiResponseText.trim(), 10);
        // kalori = 0;
        if (isNaN(kalori)) {
            console.error("Respons dari AI bukan angka yang valid. Respons mentah:", aiResponseText);
            return res.status(500).json({ 
                message: "Gagal memproses respons dari AI karena format tidak sesuai.",
                rawResponse: aiResponseText 
            });
        }

        const possibleWorkouts = await Workout.find({
            "exercises.id_exercise": { $in: workoutData.exercises.map(e => e.id_exercise) }
        }).lean();

        let matchedWorkout = null;
        for (const workout of possibleWorkouts) {
            if (isSameExercises(workout.exercises, workoutData.exercises)) {
                matchedWorkout = workout;
                break;
            }
        }

        if (!matchedWorkout) {
            try {
                await createWorkoutSchema.validateAsync(workoutData);
            } catch (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
    
            const id = await generateWorkoutId();
            const calculatedWorkout = workoutData.exercises.map((exercise) => {
                const heaviestSet = calculateHeaviestSet(exercise.sets);
                const bestVolume = calculateBestVolume(exercise.sets);
                // console.log(`Heaviest Set: ${heaviestSet}, Best Volume: ${bestVolume}`);
                return {
                    id_exercise: exercise.id_exercise,
                    sets: exercise.sets,
                    heaviest_weight: heaviestSet,
                    best_set_volume: bestVolume,
                };
            });
            workoutData.exercises = calculatedWorkout;
            const newWorkout = new Workout({ ...workoutData, id, kalori_total: kalori });
            const savedWorkout = await newWorkout.save();
            id_workout = savedWorkout.id;
            if (!savedWorkout) return res.status(500).json({ message: "Gagal menyimpan workout." }); 
        }
        else {
            id_workout = matchedWorkout.id; 
        }
        
        // cari workout history berdasarkan username dan tanggal hari ini
        const todayDate = getTodayDateString();
        const existingHistory = await WorkoutHistory.findOne({ username, tanggal: todayDate });

        if (existingHistory) {
            existingHistory.workouts.push({
                id_workout,
                time,
                duration_total: duration,
            });
            existingHistory.summary.duration = calculateDuration(existingHistory.summary.duration, duration);
            existingHistory.summary.kalori += kalori;
            await existingHistory.save();
        } else {
            // jika belum ada, buat history baru
            const workoutHistory = new WorkoutHistory({
                username,
                tanggal: todayDate,
                workouts: [{
                    id_workout,
                    time,
                    duration_total: duration,
                }],
                summary: {
                    duration,
                    kalori
                },
            });
            await workoutHistory.save();
        }
        
        return res.status(201).json({ message: "Workout history berhasil disimpan." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// GET /api/fetch
const fetchExercise = async (req, res) => {
    let options = {
        method: "GET",
        url: `https://exercisedb.p.rapidapi.com/exercises`,
        params: {
            limit: "100",
            offset: "0",
        },
        headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_APIKEY,
            "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
    };

    try {
        const response = await axios.request(options);
        const result = response.data.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            equipment: exercise.equipment,
            muscles: [exercise.target, ...(exercise.secondaryMuscles || [])],
            img: exercise.gifUrl || "",
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
        const todayHistory = await FoodHistory.findOne({
            username: req.user.username,
            tanggal,
        });

        let dataKonstektual;
        if (todayHistory && todayHistory.foods.length > 0) {
            const foodNames = todayHistory.foods.map((f) => f.name).join(", ");
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
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

const calculateCalory = async (req, res) => {
    try {
        const tanggal = getTodayDateString();
        const id_user = req.user.username || req.user.id_user;

        const todayFood = await FoodHistory.findOne({ id_user, tanggal });

        const kaloriMasuk = todayFood?.summary?.kalori || 0;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const workouts = await WorkoutHistory.find({
            id_user,
            timestamp: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        // Total kalori keluar (misalnya best_set_volume * 0.1 sebagai faktor pembakar kalori)
        const kaloriKeluar = workouts.reduce((total, w) => {
            return total + (w.best_set_volume || 0) * 0.1;
        }, 0);

        return res.status(200).json({
            tanggal,
            kaloriMasuk,
            kaloriKeluar: Math.round(kaloriKeluar),
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
  getDiary,
  scan,
  perform,
  fetchExercise,
  fetchRecommendation,
  calculateCalory,
};
