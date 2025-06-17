require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Food = require('../models/Food');
const connectDB = require('../database/connection');

const seedFoods = async () => {
    try {
        await connectDB();

        await Food.deleteMany();

        const foods = [];

        // Sample Indonesian foods
        const indonesianFoods = [
            { name: 'Beras Giling Mentah', baseCalories: 357 },
            { name: 'Nasi Putih', baseCalories: 130 },
            { name: 'Mie Instan', baseCalories: 380 },
            { name: 'Tempe', baseCalories: 193 },
            { name: 'Tahu', baseCalories: 76 },
            { name: 'Ayam Goreng', baseCalories: 250 },
            { name: 'Ikan Bakar', baseCalories: 200 },
            { name: 'Sayur Bayam', baseCalories: 23 },
            { name: 'Pisang', baseCalories: 89 },
            { name: 'Apel', baseCalories: 52 }
        ];

        for (let i = 0; i < indonesianFoods.length; i++) {
            const foodData = indonesianFoods[i];
            
            foods.push({
                id: `FNB${String(i + 1).padStart(5, '0')}`,
                name: foodData.name,
                jumlah_sajian_per_kemasan: 1,
                jumlah_per_sajian: 100,
                tipe_sajian: "gram",
                nutrient_fact_100g: {
                    energi: foodData.baseCalories,
                    lemak_total: faker.number.float({ min: 0.1, max: 20, multipleOf: 0.1 }),
                    vitamin_a: faker.number.int({ min: 0, max: 100 }),
                    vitamin_b1: faker.number.float({ min: 0, max: 2, multipleOf: 0.01 }),
                    vitamin_b2: faker.number.float({ min: 0, max: 2, multipleOf: 0.01 }),
                    vitamin_b3: faker.number.float({ min: 0, max: 20, multipleOf: 0.1 }),
                    vitamin_c: faker.number.int({ min: 0, max: 100 }),
                    karbohidrat_total: faker.number.float({ min: 0, max: 80, multipleOf: 0.1 }),
                    protein: faker.number.float({ min: 0, max: 30, multipleOf: 0.1 }),
                    serat_pangan: faker.number.float({ min: 0, max: 10, multipleOf: 0.1 }),
                    kalsium: faker.number.int({ min: 0, max: 200 }),
                    fosfor: faker.number.int({ min: 0, max: 300 }),
                    natrium: faker.number.int({ min: 0, max: 1000 }),
                    kalium: faker.number.int({ min: 0, max: 500 }),
                    tembaga: faker.number.int({ min: 0, max: 200 }),
                    besi: faker.number.float({ min: 0, max: 20, multipleOf: 0.1 }),
                    seng: faker.number.float({ min: 0, max: 10, multipleOf: 0.1 }),
                    b_karoten: faker.number.int({ min: 0, max: 1000 }),
                    karoten_total: faker.number.int({ min: 0, max: 1000 }),
                    air: faker.number.float({ min: 0, max: 90, multipleOf: 0.1 }),
                    abu: faker.number.float({ min: 0, max: 5, multipleOf: 0.1 })
                },
                nutrient_fact_per_serving: {
                    energi: Math.round(foodData.baseCalories * 1.0), // per 100g serving
                    lemak_total: faker.number.float({ min: 0.1, max: 20, multipleOf: 0.1 }),
                    protein: faker.number.float({ min: 0, max: 30, multipleOf: 0.1 }),
                    karbohidrat_total: faker.number.float({ min: 0, max: 80, multipleOf: 0.1 })
                },
                image: faker.image.urlLoremFlickr({ category: 'food' })
            });
        }

        await Food.insertMany(foods);
        console.log(`Seeder: ${foods.length} foods successfully created!`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed foods:', error);
        process.exit(1);
    }
};

seedFoods();