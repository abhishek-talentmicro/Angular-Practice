// import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { Subject } from 'rxjs';
import { SessionService } from 'src/app/modules/login/services/session/session.service';
// import { PushNotification } from 'src/app/classes/shared/push-notification/push-notification';
import { Injectable } from '@angular/core';

// let app = firebase.initializeApp({
//   // apiKey: "AIzaSyCcvQgZSArBsoM0Jj316bvZK4UqAPZjBV4",
//   // authDomain: "tallint-39caf.firebaseapp.com",
//   // databaseURL: "https://tallint-39caf.firebaseio.com",
//   // projectId: "tallint-39caf",
//   // storageBucket: "",
//   // messagingSenderId: "995040321254",
//   // appId: "1:995040321254:web:b56383f7480034acdf6527"

//   apiKey: "AIzaSyCcvQgZSArBsoM0Jj316bvZK4UqAPZjBV4",
//   authDomain: "tallint-39caf.firebaseapp.com",
//   databaseURL: "https://tallint-39caf.firebaseio.com",
//   projectId: "tallint-39caf",
//   storageBucket: "tallint-39caf.appspot.com",
//   messagingSenderId: "995040321254",
//   appId: "1:995040321254:web:b56383f7480034acdf6527"
// });

// export const messaging = app.messaging();
// @Injectable()
// export class FirebaseMessagingService {
//   notifications_subject: Subject<PushNotification> = new Subject();
//   constructor(private session_service: SessionService) {
//     this.initFirebaseApp();
//     messaging.onMessage((payload) => {

//       let notification = new PushNotification();
//       notification.setData(payload);
//       this.notifications_subject.next(notification);
//     });

//     this.notifications_subject.subscribe(res => {

//     })
//   } f

//   initFirebaseApp() {
//     messaging.usePublicVapidKey("BOT_jhbFcgbArIyEpgkh1rlxVZLPkLUEiUIwAv2pTvnaebUlHJP4LB3PF95J04V_oy5TSVpnm-qz1lH6mo2qQpg");
//     Notification.requestPermission().then((permission) => {
//       if (permission === 'granted') {

//         // TODO(developer): Retrieve an Instance ID token for use with FCM.
//         messaging.getToken().then((currentToken) => {
//           if (currentToken) {

//             this.session_service.updateNotificationRegId(currentToken);
//           } else {
//             // Show permission request.

//             // Show permission UI.
//           }
//         }).catch((err) => {

//         });
//         // ...
//       } else {

//       }
//     });
//   }
// }
