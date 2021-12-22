import { readdirSync, readFileSync, writeFileSync } from 'fs';


class _Cache {

    /** Restore cache from file system */
    constructor() {
        console.log("Cache loading...");
        readdirSync('./cache').forEach(filename => {
            // TODO: Load cache
            console.log(`Loading ${filename.split('.json')[0]}`);
            this.storage.set(filename.split('.json')[0], readFileSync(`./cache/${filename}`, 'utf-8') as any);
           
        })
        console.log("Cache loading done...");
    }

    storage: Map<string, string> = new Map();

    private urlToName = url => {
        return url.replace(/[^a-zA-Z0-9 -]/g, '');
    }

    private saveMap() {
        this.storage.forEach((data, url, map) => {
            const name = `./cache/${this.urlToName(url)}.json`;;
            writeFileSync(name, data);
        })
    }

    store(url: string, data: string) {
        this.storage.set(this.urlToName(url), JSON.stringify(data));
        this.saveMap();
    }

    get(url: string) {
        return !!this.storage.get(this.urlToName(url)) ? JSON.parse(this.storage.get(this.urlToName(url)) as any) : null;
    }
}

export const Cache = new _Cache();