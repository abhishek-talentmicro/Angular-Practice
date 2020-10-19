export class User {
    // _full_name: string;
    _first_name: string;
    _last_name: string;
    _username: string;
    _user_id: number;
    _email_id: string;
    _mobile_number: string;
    _token: string;
   
    // set full_name(value) {
    //     this._full_name = value;
    // }

    set first_name(value) {
        this._first_name = value;
    }

    set last_name(value) {
        this._last_name = value;
    }

   

    set user_name(value) {
        this._username = value;
    }

    set user_id(value) {
        this._user_id = value;
    }

    set email_id(value) {
        this._email_id = value;
    }

    set phone_number(value) {
        this._mobile_number = value;
    }

    set token(value) {
        this._token = value;
    }

    get user_id() {
        return this._user_id;
    }



    get token() {
        return this._token;
    }
}