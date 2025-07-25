import {Stats} from "fs"

export class MyStats {
    constructor(public mtimeMs: number) {
    }

    static fromStats(stats: Stats, path: string): MyStats {
        const match = path.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2})-(\d{2}) (\d+)/);
        if (match) {
            const o = {
                year: parseInt(match[1], 10),
                month: parseInt(match[2], 10) - 1, // Months are 0-based in JavaScript
                day: parseInt(match[3], 10),
                hours: parseInt(match[4], 10),
                minutes: parseInt(match[5], 10),
                ms: parseInt(match[6], 10)
            };
            const date = new Date(o.year, o.month, o.day, o.hours, o.minutes, 0, o.ms);
            console.log(date);
            return new MyStats(date.getTime());
        }
        return new MyStats(stats.mtimeMs)
    }
}
