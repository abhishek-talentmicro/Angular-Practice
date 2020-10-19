import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptorService } from './services/http-interceptor/error-interceptor/error-interceptor.service';
import { RequestInterceptorService } from './services/http-interceptor/request-interceptor/request-interceptor.service';
import { LoginComponent } from './components/login/login.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SsoComponent } from './components/sso/sso.component';
import { AngularMaterialModule } from 'src/app/material.module';


@NgModule({
  declarations: [
    LoginComponent,
    PasswordManagerComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    SsoComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true },
  ],
  entryComponents: [
    ForgotPasswordComponent,
    ChangePasswordComponent
  ],
  exports: [
    LoginComponent,
    PasswordManagerComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
  ]
})
export class LoginModule { }
