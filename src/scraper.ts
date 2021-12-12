import axios from 'axios';
import { config } from 'dotenv';
import { plot, Plot } from 'nodeplotlib';

import { getDefaultOptions } from './helper';
import { Restaurant } from './models/restaurants';


if (!process.env.produtction) config();

async function userInfo() {
    const res = await axios('https://cw-api.takeaway.com/api/v28/user', getDefaultOptions());
    console.log(res.data);
}

async function scrape() {
    const res = await axios(
        'https://cw-api.takeaway.com/api/v28/restaurants?deliveryAreaId=1205662&postalCode=97080&lat=49.8017703&lng=9.9514435&limit=0',
        getDefaultOptions()
    );

    // Fetch all restaurants
    const allRestaurants: Restaurant[] = [];
    Object.keys(res.data['restaurants']).forEach(restId => {
        allRestaurants.push(new Restaurant(res.data['restaurants'][restId]));
    });

    const max = allRestaurants.length;
    for (let i = 1; i < max; i++) {
        const element = allRestaurants[i];
        await element.initiateGetDetailedInformation();
        console.log(element.hasDetailedInformation);
    }

    let h = {};
    let h2 = {};

    allRestaurants
        .filter(r => r.hasDetailedInformation)
        .forEach(restaurant => {
            const pizzas = restaurant.products.filter(p => p.isPizza);

            /** Count square meter stuff */

            const roundedSquareMeters = pizzas.filter(p => (p.pizzaDiameter == 32)).map(p => Math.round(p.price / 100));
            const roundedSquareMeters2 = pizzas.filter(p => p.pizzaDiameter == 26).map(p => Math.round(p.price / 100));

            roundedSquareMeters.forEach(sm => {
                if (h[sm]) {
                    h[sm]++;
                } else {
                    h[sm] = 1;
                }
            });
            roundedSquareMeters2.forEach(sm => {
                if (h2[sm]) {
                    h2[sm]++;
                } else {
                    h2[sm] = 1;
                }
            });
        });

    let x: number[] = [];
    let y: number[] = [];
    let x2: number[] = [];
    let y2: number[] = [];

    for (var i = 0; i < Object.keys(h).length; i++) {
        x.push(Number(Object.keys(h)[i]));
        y.push(Number(h[Object.keys(h)[i]]));
    }
    for (var i = 0; i < Object.keys(h2).length; i++) {
        x2.push(Number(Object.keys(h2)[i]));
        y2.push(Number(h2[Object.keys(h2)[i]]));
    }

    console.log(h2 == h);

    const barData: Plot[] = [
        { x, y, type: 'bar' as any, name: '32cm' },
        { x: x2, y: y2, type: 'bar' as any, name: '26cm' }
    ];

    plot(barData);
}

scrape();
