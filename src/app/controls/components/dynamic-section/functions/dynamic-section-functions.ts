import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationComponent } from 'src/app/modules/shared/confirmation/confirmation.component';
import { Type } from '@angular/core';
// import { DynamicDialogComponent } from '../../dynamic-dialog/dynamic-dialog.component';
// import { SkillDetailsComponent } from 'src/app/modules/ATS/configuration/components/master/skills/skill-details/skill-details.component';
// import { LocationDetailsComponent } from 'src/app/modules/ATS/configuration/components/master/location/location-details/location-details.component';
// import { ConfirmationComponent } from 'src/app/modules/shared/confirmation/confirmation.component';
// import { DesignationDetailsComponent } from 'src/app/modules/ATS/configuration/components/master/designation/designation-details/designation-details.component';

export function addMasters(dialog, id_property, title_property, callBackFn, form_code) {
    let out_arr = [];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%'
    // dialogConfig.data = {
    //     component: SkillDetailsComponent
    // }
    let dialogRef;
    // if (form_code == 5022) {
    //     // dialogRef = dialog.open(ConfirmationComponent, dialogConfig);
    //     dialogRef = dialog.open(SkillDetailsComponent, dialogConfig);
    // }

    // else if (form_code == 5035) {
    //     // dialogRef = dialog.open(ConfirmationComponent, dialogConfig);
    //     dialogRef = dialog.open(LocationDetailsComponent, dialogConfig);
    // }

    // else if (form_code == 1000090) {
    //     dialogRef = dialog.open(DesignationDetailsComponent, dialogConfig);
    // }

    // (dialogRef.componentInstance).modal_view = 1;
    // (dialogRef.componentInstance).id_property = id_property;
    // (dialogRef.componentInstance).title_property = title_property;
    // dialogRef.afterClosed().subscribe(value => {
    //     if (value) {
    //         console.log(value);
    //         out_arr = value;
    //         callBackFn(out_arr);
    //         // return out_arr || []
    //     }
    // }, err => {
    //     return out_arr || []
    // })
    // return out_arr || []

}


export class createComponentInstance {
    constructor(public component: Type<any>, public data: any) { }
}


export function sendWhatMateNotification(name, number, service_fn, notification_svc, dialogRef) {
    let message;
    message = 'Please click on proceed to send the contact details to your WhatMate account'
    const dialog = dialogRef.open(ConfirmationComponent, {
        width: '300px',
        data: {
            title: "Confirmation",
            message: message,
            positive_button: 'Proceed',
            negative_button: "Cancel",
        }
    });
    dialog.afterClosed().subscribe(res => {
        if (res) {
            let param = {
                applicant_mobile_number: number || 0,
                applicant_mobile_isd: 0,
                applicant_name: name || ''
            }
            service_fn.sendNotification(param).subscribe(res => {
                notification_svc.snackbar(res['message'], 'Close', 5000)
            })
        }

    })
}