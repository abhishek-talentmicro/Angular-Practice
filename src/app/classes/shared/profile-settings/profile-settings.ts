export class ProfileSettings {
    files: any; short_signature: string;
    long_signature: string;
    assign_to: number;
    update_flag: number;
    user_id: number;
    time_zone_id: number;
    extension_number: number;
    //set default values when object is instatiated
    setData(obj = {
        files: null,
        short_signature: '',
        long_signature: '',
        assign_to: null,
        update_flag: 1,
        user_id: 0,
        time_zone_id: null,
        extension_number: null,

    }) {
        this.files = obj.files || null;
        this.short_signature = obj.short_signature || '';
        this.long_signature = obj.long_signature || '';
        this.assign_to = obj.assign_to || null;
        this.update_flag = 1;
        this.user_id = this.user_id || 0;
        this.time_zone_id = obj.time_zone_id || null;
        this.extension_number = obj.extension_number || null;

    }
    //function to return values which are required for the form group
    getFormGroupData() {
        return {
            extension_number: this.extension_number || null,
            short_signature: this.short_signature || '',
            long_signature: this.long_signature || '',
            assign_to: this.assign_to || null,
            time_zone_id: this.time_zone_id || null,
        }
    }
    //function to set the values entered in the formgroup into the object
    setFormGroupData(obj) {
        this.extension_number = obj.extension_number || null;
        this.short_signature = obj.short_signature;
        this.long_signature = obj.long_signature;
        this.assign_to = obj.assign_to;
        this.update_flag = 1;
        this.user_id = obj.user_id;
        this.time_zone_id = obj.time_zone_id || null;

    }
}