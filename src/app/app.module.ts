import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
//import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { ProgressBarModule } from 'primeng/progressbar';
import { LoginComponent } from './demo/components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';


@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule, FormsModule, BrowserModule, BrowserAnimationsModule, DialogModule, ProgressBarModule,
        ReactiveFormsModule, ToastModule, LoginComponent],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },

        ConfirmationService, HttpClientModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
