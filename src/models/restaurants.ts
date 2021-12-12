import axios from 'axios';

import { getDefaultOptions } from '../helper';
import { Product } from './product';


export interface RestaurantIndicator {
    isDeliveryByScoober: boolean;
    isNew: boolean;
    isTestRestaurant: boolean;
    isSponsored: boolean;
}

export interface RestaurantBrand {
    name: string;
    logoUrl: string;
    heroImageUrl: string;
    heroImageUrlType: string;
    branchName: string;
}

export interface RestaurantRating {
    votes: number;
    score: number;
}

export interface RestaurantLocation {
    streetAddress: string;
    city: string;
    country: string;
    lat: string;
    lng: string;
    timeZone: string;
}

export interface RestaurantSupportables {
    delivery: boolean;
    pickup: boolean;
    vouchers: boolean;
    stampCards: boolean;
    discounts: boolean;
}

export interface RestaurantShippingInfo {
    delivery: {
        isOpenForOrder: boolean;
        isOpenForPreorder: boolean;
        openingTime;
        duration: number;
        durationRange: { min: number; max: number };
        deliveryFeeDefault: number;
        minOrderValue: number;
        lowestDeliveryFee: { from: number; fee: number };
    };
    pickup: { isOpenForOrder: true; isOpenForPreorder: true; openingTime: null; distance: { unit: string; quantity: number } };
}

export interface DeliveryOptions {
    times: {
        '0': [{ start: 840; end: 1320; formattedStart: '14:00'; formattedEnd: '22:00' }];
        '1': [{ start: 840; end: 1320; formattedStart: '14:00'; formattedEnd: '22:00' }];
        '2': [{ start: 840; end: 1320; formattedStart: '14:00'; formattedEnd: '22:00' }];
        '3': [{ start: 840; end: 1320; formattedStart: '14:00'; formattedEnd: '22:00' }];
        '4': [{ start: 840; end: 1320; formattedStart: '14:00'; formattedEnd: '22:00' }];
        '5': [{ start: 840; end: 1320; formattedStart: '14:00'; formattedEnd: '22:00' }];
        '6': [{ start: 840; end: 1320; formattedStart: '14:00'; formattedEnd: '22:00' }];
    };
    isOpenForOrder: boolean;
    isOpenForPreorder: boolean;
    isScooberRestaurant: boolean;
    durationRange: { min: number; max: number };
}

export class Restaurant {
    id: string;
    primarySlug: string;

    indicators: RestaurantIndicator;
    priceRange: number;
    popularity: number;
    brand: RestaurantBrand;
    cuisineTypes: string[];
    rating: RestaurantRating;
    location: RestaurantLocation;
    supports: RestaurantSupportables;
    shippingInfo: RestaurantShippingInfo;
    paymentMethods: string[];
    deliveryOptions: DeliveryOptions;
    currency: { denominator: number; code: string };

    products: Product[];

    hasDetailedInformation: boolean;

    constructor(lieferandoJsonObject: any) {
        this.id = lieferandoJsonObject.id;
        this.primarySlug = lieferandoJsonObject.primarySlug;
        this.indicators = lieferandoJsonObject.indicators;
        this.priceRange = lieferandoJsonObject.priceRange;
        this.brand = lieferandoJsonObject.brand;
        this.cuisineTypes = lieferandoJsonObject.cuisineTypes;
        this.rating = lieferandoJsonObject.rating;
        this.location = lieferandoJsonObject.location;
        this.supports = lieferandoJsonObject.supports;
        this.shippingInfo = lieferandoJsonObject.shippingInfo;
        this.paymentMethods = lieferandoJsonObject.paymentMethods;
    }

    async initiateGetDetailedInformation() {
        const res = await axios('https://cw-api.takeaway.com/api/v28/restaurant?slug=' + this.primarySlug, getDefaultOptions());

        this.deliveryOptions = res.data.delivery as DeliveryOptions;


        this.currency = res.data.menu.currency;

        const products: Product[] = [];
        Object.keys(res.data.menu.products).forEach(productId => {
            const product = res.data.menu.products[productId];
            const name = product.name;
            product.variants.forEach(variant => {
                products.push(
                    new Product(name, variant.description, variant.id, variant.prices.delivery, variant.name)
                )
            });
        });

        this.products = products;

        this.hasDetailedInformation = true;
    }
}
