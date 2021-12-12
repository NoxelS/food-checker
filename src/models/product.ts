export class Product {
    isPizza: boolean = false;
    pizzaDiameter: number;
    pricePerSquareMeter: number;
    constructor(public name: string, public description: string[], public id: string, public price: number, public subName: string) {
        if (subName && ~subName.indexOf('Ø') && ~name.indexOf('Pizza')) {
            this.isPizza = true;
            try {
                this.pizzaDiameter = Number(subName.split('Ø')[1].split('cm')[0]);
                this.pricePerSquareMeter = this.price / ((Math.PI * (this.pizzaDiameter / 2)) ^ 2);
            } catch (error) {
                console.log('Error: ' + subName);
            }
        }
    }
}
