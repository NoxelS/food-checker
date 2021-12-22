import axios from 'axios';
import { config } from 'dotenv';
import { plot } from 'nodeplotlib';

import { getDefaultOptions } from './helper';
import { Restaurant } from './models/restaurants';
import { getDataPointsForSpecificPizzaSize } from './plots';


if (!process.env.produtction) config();

async function scrape() {
    const saarbrücken = 'https://cw-api.takeaway.com/api/v28/restaurants?deliveryAreaId=1216856&postalCode=66121&lat=49.2335973&lng=7.007348599999999&limit=0';
    const würzburg = 'https://cw-api.takeaway.com/api/v28/restaurants?deliveryAreaId=1205662&postalCode=97080&lat=49.8017703&lng=9.9514435&limit=0';
    const mainz = 'https://cw-api.takeaway.com/api/v28/restaurants?deliveryAreaId=1215310&postalCode=55116&lat=50.0012501&lng=8.258543000000001&limit=0';
    
    const res = await axios(mainz, getDefaultOptions());

    // Fetch all restaurants
    const allRestaurants: Restaurant[] = [];
    Object.keys(res.data['restaurants']).forEach(restId => {
        allRestaurants.push(new Restaurant(res.data['restaurants'][restId]));
    });

    console.log('Getting detailed information');
    const max = allRestaurants.length;
    for (let i = 1; i < max; i++) {
        const element = allRestaurants[i];
        await element.initiateGetDetailedInformation();
    }

    let diamters = {};

    /** Find all pizza diameters */
    allRestaurants
        .filter(r => r.hasDetailedInformation)
        .forEach(restaurant => {
            restaurant.products
                .filter(p => p.isPizza)
                .filter(p => !!p.pizzaDiameter)
                .forEach(pizza => {
                    if (!diamters[pizza.pizzaDiameter]) {
                        diamters[pizza.pizzaDiameter] = true;
                    }
                });
        });

    plot(Object.keys(diamters).map(d => getDataPointsForSpecificPizzaSize(allRestaurants, Number(d))));
    plot(Object.keys(diamters).map(d => getDataPointsForSpecificPizzaSize(allRestaurants, Number(d))));
}

scrape();
