export class Tabs {
    tab_id: string;
    title: string;
    details: Object;

    constructor() {
        this.title = "Untitled";
        this.details = null;

        this.tab_id = "tab" + Math.floor((Math.random() * 10000) + 1);
    }
}