/* 
 Created 
    by:Upendram Reddy Tanuja
    on: 13-Nov-2019 07:25 Pm
    purpose:class for  Filter Resume details*/
export class FilterDetails {
    skills: any[];
    designation: any[];
    education: any[];
    location: any[];
    experience_from: number;
    experience_to: number;
    notice_period_from: number;
    notice_period_to: number;
    currency: number;
    duration: number;
    scale: number;
    ctc_from: number;
    ctc_to: number;
    keywords: string;
    skill_and: number;
    location_and: number;
    designation_and: number;
    education_and: number;
    notice_period_and: number;
    experience_and: number;
    ctc_and: number;
    keywords_and: number;
    //static variables to store the data which are common for all languages 

    //set default values when object is instatiated
    constructor(obj = {
        skills: null,
        designation: null,
        education: null,
        location: null,
        experience_from: null,
        experience_to: null,
        notice_period_from: null,
        notice_period_to: null,
        currency: null,
        duration: null,
        scale: null,
        ctc_from: null,
        ctc_to: null,
        keywords: "",
        skill_and: 0,
        location_and: 0,
        designation_and: 0,
        education_and: 0,
        notice_period_and: 0,
        experience_and: 0,
        ctc_and: 0,
        keywords_and: 0



    }) {

        this.skills = obj.skills || [];
        this.designation = obj.designation || [];
        this.education = obj.education || [];
        this.location = obj.location || [];
        this.experience_from = obj.experience_from || null;
        this.experience_to = obj.experience_to || null;
        this.notice_period_from = obj.notice_period_from || null;
        this.notice_period_to = obj.notice_period_to || null;
        this.currency = obj.currency || 0;
        this.duration = obj.duration || 0;
        this.scale = obj.scale || 0;
        this.ctc_from = obj.ctc_from || null;
        this.ctc_to = obj.ctc_to || null;
        this.keywords = obj.keywords || '';
        if (typeof (obj.skill_and) == 'boolean') {
            obj.skill_and = obj.skill_and ? 1 : 0;
        }
        this.skill_and = obj.skill_and || 0;
        if (typeof (obj.location_and) == 'boolean') {
            obj.location_and = obj.location_and ? 1 : 0;
        }
        this.location_and = obj.location_and || 0;
        if (typeof (obj.designation_and) == 'boolean') {
            obj.designation_and = obj.designation_and ? 1 : 0;
        }
        this.designation_and = obj.designation_and || 0;
        if (typeof (obj.education_and) == 'boolean') {
            obj.education_and = obj.education_and ? 1 : 0;
        }
        this.education_and = obj.education_and || 0;
        if (typeof (obj.notice_period_and) == 'boolean') {
            obj.notice_period_and = obj.notice_period_and ? 1 : 0;
        }
        this.notice_period_and = obj.notice_period_and || 0;
        if (typeof (obj.experience_and) == 'boolean') {
            obj.experience_and = obj.experience_and ? 1 : 0;
        }
        this.experience_and = obj.experience_and || 0;
        if (typeof (obj.ctc_and) == 'boolean') {
            obj.ctc_and = obj.ctc_and ? 1 : 0;
        }
        this.ctc_and = obj.ctc_and || 0;
        if (typeof (obj.keywords_and) == 'boolean') {
            obj.keywords_and = obj.keywords_and ? 1 : 0;
        }
        this.keywords_and = obj.keywords_and || 0;
    }
    //initilaize language values to the object 
    setData(obj) {
        this.skills = obj.skills || [];
        this.designation = obj.designation || [];
        this.education = obj.education || [];
        this.location = obj.location || [];
        this.experience_from = obj.experience_from || null;
        this.experience_to = obj.experience_to || null;
        this.notice_period_from = obj.notice_period_from || null;
        this.notice_period_to = obj.notice_period_to || null;
        this.currency = obj.currency || 0;
        this.duration = obj.duration || 0;
        this.scale = obj.scale || 0;
        this.ctc_from = obj.ctc_from || null;
        this.ctc_to = obj.ctc_to || null;
        this.keywords = obj.keywords || '';
        if (typeof (obj.skill_and) == 'boolean') {
            obj.skill_and = obj.skill_and ? 1 : 0;
        }
        this.skill_and = obj.skill_and || 0;
        if (typeof (obj.location_and) == 'boolean') {
            obj.location_and = obj.location_and ? 1 : 0;
        }
        this.location_and = obj.location_and || 0;
        if (typeof (obj.designation_and) == 'boolean') {
            obj.designation_and = obj.designation_and ? 1 : 0;
        }
        this.designation_and = obj.designation_and || 0;
        if (typeof (obj.education_and) == 'boolean') {
            obj.education_and = obj.education_and ? 1 : 0;
        }
        this.education_and = obj.education_and || 0;
        if (typeof (obj.notice_period_and) == 'boolean') {
            obj.notice_period_and = obj.notice_period_and ? 1 : 0;
        }
        this.notice_period_and = obj.notice_period_and || 0;
        if (typeof (obj.experience_and) == 'boolean') {
            obj.experience_and = obj.experience_and ? 1 : 0;
        }
        this.experience_and = obj.experience_and || 0;
        if (typeof (obj.ctc_and) == 'boolean') {
            obj.ctc_and = obj.ctc_and ? 1 : 0;
        }
        this.ctc_and = obj.ctc_and || 0;
        if (typeof (obj.keywords_and) == 'boolean') {
            obj.keywords_and = obj.keywords_and ? 1 : 0;
        }
        this.keywords_and = obj.keywords_and || 0;
    }

    //function  to return values which are required for the form group
    // getFormGroupData() {
    //     return {
    //         skill: this.skill || [],
    //         location: this.location || [],
    //         department: this.department || [],
    //         industry: this.industry || []

    //     }
    // }

    // //function to set the values entered in the form group  in to the object 
    // setFormGroupData(obj) {

    //     this.skill = obj.skill;
    //     this.location = obj.location;
    //     this.department = obj.department;
    //     this.industry = obj.industry;

    // }


}