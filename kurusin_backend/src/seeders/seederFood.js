const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Food = require('../models/Food');

faker.seed(50);

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Food.deleteMany({});
    const foods = [];
    for (let i = 0; i < 10; i++) {
        const nutrientData = () => ({
            energi: faker.number.int({ min: 10, max: 500 }),
            lemak_total: faker.number.float({ min: 0, max: 30 }),
            vitamin_a: faker.number.float({ min: 0, max: 100 }),
            vitamin_b1: faker.number.float({ min: 0, max: 100 }),
            vitamin_b2: faker.number.float({ min: 0, max: 100 }),
            vitamin_b3: faker.number.float({ min: 0, max: 100 }),
            vitamin_c: faker.number.float({ min: 0, max: 100 }),
            karbohidrat_total: faker.number.float({ min: 0, max: 50 }),
            protein: faker.number.float({ min: 0, max: 50 }),
            serat_pangan: faker.number.float({ min: 0, max: 10 }),
            kalsium: faker.number.float({ min: 0, max: 100 }),
            fosfor: faker.number.float({ min: 0, max: 100 }),
            natrium: faker.number.float({ min: 0, max: 100 }),
            kalium: faker.number.float({ min: 0, max: 100 }),
            tembaga: faker.number.float({ min: 0, max: 10 }),
            besi: faker.number.float({ min: 0, max: 10 }),
            seng: faker.number.float({ min: 0, max: 10 }),
            b_karoten: faker.number.float({ min: 0, max: 50 }),
            karoten_total: faker.number.float({ min: 0, max: 100 }),
            air: faker.number.float({ min: 0, max: 90 }),
            abu: faker.number.float({ min: 0, max: 10 }),
        });

        foods.push(new Food({
            id: faker.string.uuid(),
            name: faker.commerce.productName(),
            jumlah_sajian_per_kemasan: faker.number.int({ min: 1, max: 3 }),
            jumlah_per_sajian: faker.number.int({ min: 10, max: 250 }),
            tipe_sajian: 'g',
            nutrient_fact_100g: nutrientData(),
            nutrient_fact_per_serving: nutrientData(),
            image: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
        }));
    }

    await Food.insertMany(foods);
    console.log('Dummy foods seeded!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
