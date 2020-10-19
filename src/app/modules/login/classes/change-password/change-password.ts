/*
  Created 
    by: Pramod Kumar Reddy
    on: 26-Jul-2019 1:00 PM
    purpose: class for change password
    
*/

export class ChangePassword {

    current_password: string;
    new_password: string;
    reenter_password: string;
    user_id: number;


    //static variables to store the data which are common for all languages
    static suser_id: number;

    //set default values when object is instatiated
    setData(obj = {
        current_password: null,
        new_password: null,
        reenter_password: null,

    }) {
        this.current_password = obj.current_password || null;
        this.new_password = obj.new_password || null;
        this.reenter_password = obj.reenter_password || null;

    }


    //function to return values which are required for the form group
    getFormGroupData() {
        return {
            current_password: this.current_password || null,
            new_password: this.new_password || null,
            reenter_password: this.reenter_password || null,
        }
    }
    //function to set the values entered in the formgroup into the object
    setFormGroupData(obj) {

        this.current_password = obj.current_password;
        this.new_password = obj.new_password;
        this.reenter_password = obj.reenter_password;

        this.setStaticVariables();
    }
    //function to set the values of the object to static variables
    private setStaticVariables() {
        ChangePassword.suser_id = this.user_id;

    }
    //function to reset the static variables
    resetStaticVariables() {

        ChangePassword.suser_id = 0;
    }


}