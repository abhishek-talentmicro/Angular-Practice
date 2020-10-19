export class Session {
    access_token: string;
    token_type: string;
    expires_in: number;
    user_id: number;
    userName: string;
    employeeCode: string;
    jobTitle: string;
    refresh_token: string;

    setData(obj = {
        access_token: null,
        token_type: null,
        expires_in: null,
        user_id: 0,
        UserId: 0,
        userName: null,
        employeeCode: null,
        jobTitle: null,
        refresh_token: null
    }) {
        if (obj) {
            this.access_token = obj.access_token || null;
            this.token_type = obj.token_type || null;
            this.expires_in = obj.expires_in || null;
            this.user_id = obj.user_id || obj.UserId || 0 ;
            this.userName = obj.userName || null;
            this.employeeCode = obj.employeeCode || null;
            this.jobTitle = obj.jobTitle || null;
            this.refresh_token = obj.refresh_token || null;
        }
    }
}