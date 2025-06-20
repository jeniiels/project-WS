const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const FoodHistory = require('../models/FoodHistory');
const foodsRaw = require('../data/db_kurusin.foods.json');

require('dotenv').config();
faker.seed(50);

const N_USERS = ['jeniels', 'Danny.Hyatt', 'Terrence.Reinger', 'Gretchen_MacGyver'];

const getRandomFoods = (count = 3) => {
    const selected = faker.helpers.arrayElements(foodsRaw, count);
    return selected.map((f, index) => {
        const jumlah = faker.number.int({ min: 1, max: 3 });
        const kalori_total = f.nutrient_fact_100g?.energi ? f.nutrient_fact_100g.energi * jumlah : 0;
        return {
            id: index + 1,
            name: f.name,
            jumlah,
            tipe_sajian: f.tipe_sajian || 'g',
            kalori_total
        };
    });
};

const summarize = (foods) => {
  let summary = { kalori: 0, protein: 0, lemak: 0, karbohidrat: 0 };
  foods.forEach(f => {
        const found = foodsRaw.find(x => x.name === f.name);
        const nutr = found?.nutrient_fact_100g || {};
        summary.kalori += f.kalori_total;
        summary.protein += (nutr.protein || 0) * f.jumlah;
        summary.lemak += (nutr.lemak_total || 0) * f.jumlah;
        summary.karbohidrat += (nutr.karbohidrat_total || 0) * f.jumlah;
  });
  Object.keys(summary).forEach(k => summary[k] = Math.round(summary[k] * 100) / 100);
  return summary;
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await FoodHistory.deleteMany();

    const data = [];

    for (let i = 0; i < 7; i++) {
        const username = faker.helpers.arrayElement(N_USERS);
        const tanggal = faker.date.recent({ days: 14 }).toISOString().slice(0, 10);
        const foods = getRandomFoods(faker.number.int({ min: 2, max: 4 }));
        const summary = summarize(foods);

        data.push(new FoodHistory({
            username,
            tanggal,
            foods,
            summary
        }));
    }

    await FoodHistory.insertMany(data);
    console.log('Dummy FoodHistory seeded!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
