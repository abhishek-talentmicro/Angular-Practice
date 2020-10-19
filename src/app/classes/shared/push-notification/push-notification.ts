export class PushNotification {
    title: string;
    body: string;
    payload: string;

    constructor() { }

    setData(obj) {

        if (obj) {
            if (obj.data) {
                this.title = obj.data.title;
                this.body = obj.data.body;
            }
            if (obj && obj.data && typeof obj.data["payload"] == 'string') {
                this.payload = JSON.parse(obj.data["payload"]);
            }
        }
    }
}