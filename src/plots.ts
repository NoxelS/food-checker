import { Plot } from 'nodeplotlib';

import { Restaurant } from './models/restaurants';


export function getDataPointsForSpecificPizzaSize(allRestaurants: Restaurant[], diameterInCm) {
    let h = {};

    allRestaurants
        .filter(r => r.hasDetailedInformation)
        .forEach(restaurant => {
            const pizzas = restaurant.products.filter(p => p.isPizza);

            /** Count square meter stuff */

            const roundedSquareMeters = pizzas.filter(p => p.pizzaDiameter == diameterInCm).map(p => Math.round(p.price / 100));

            roundedSquareMeters.forEach(sm => {
                if (h[sm]) {
                    h[sm]++;
                } else {
                    h[sm] = 1;
                }
            });
        });

    let x: number[] = [];
    let y: number[] = [];

    for (var i = 0; i < Object.keys(h).length; i++) {
        x.push(Number(Object.keys(h)[i]));
        y.push(Number(h[Object.keys(h)[i]]));
    }

    // y = y.map(data => data / Math.max(...y));

    x = x.map(x => (Math.round((x / ((Math.PI * ((diameterInCm * 0.01) / 2)) ^ 2)) * 100) / 100) * (Math.PI * (0.32 * 0.01)^2));

    const barData: Plot = { x, y, type: 'line' as any, name: diameterInCm + 'cm', labels: ['test'] };

    return barData;
}
