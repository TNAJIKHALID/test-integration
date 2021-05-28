import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {GoogleChartsModule} from 'angular-google-charts';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptorService} from './_service/_interceptor/jwt-interceptor.service';
import {LoaderInterceptorService} from './_service/_interceptor/loader-interceptor.service';
import {DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TestInterfaceComponent } from './_evaluation/test-interface/test-interface.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {DemoHomeComponent} from './_user/_apprenantLibre/demo-home/demo-home.component';
import {DemoDashboardComponent} from './_user/_apprenantLibre/demo-dashboard/demo-dashboard.component';
import {FormationLibreComponent} from './_user/_apprenantLibre/formation-libre/formation-libre.component';
import {EvaluationLibreComponent} from './_user/_apprenantLibre/evaluation-libre/evaluation-libre.component';
import {EntrainementLibreComponent} from './_user/_apprenantLibre/entrainement-libre/entrainement-libre.component';
import {PositionTestLibreComponent} from './_user/_apprenantLibre/position-test-libre/position-test-libre.component';
import {TestParametersComponent} from './_evaluation/test-parameters/test-parameters.component';
import {LoginComponent} from './_connexion/login/login.component';
import {MatDividerModule} from '@angular/material/divider';
import {TestOnlyComponent} from './_evaluation/test-only/test-only.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormatTimePipe} from './pipes/FormatTimePipe';
import {ScoreComponent} from './_evaluation/score/score.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HomeComponent } from './_static/home/home.component';
import { ErrorComponent } from './_static/error/error.component';
import {PositionTestComponent} from './_evaluation/position-test/position-test.component';
import {ConfirmationDialogComponent} from './_static/confirmation-dialog/confirmation-dialog.component';
import {PositionTestUpdatedComponent} from "./_evaluation/position-test-updated/position-test-updated.component";
import { PositionIntegrationComponent } from './_demos/position-integration/position-integration.component';

@NgModule({
  declarations: [
    AppComponent,
    FormatTimePipe,
    LoginComponent,
    PositionTestComponent,
    TestInterfaceComponent,
    TestOnlyComponent,
    ScoreComponent,
    PositionTestLibreComponent,
    TestParametersComponent,
    EntrainementLibreComponent,
    EvaluationLibreComponent,
    FormationLibreComponent,
    DemoDashboardComponent,
    DemoHomeComponent,
    HomeComponent,
    ConfirmationDialogComponent,
    PositionTestUpdatedComponent,
    ErrorComponent,
    PositionIntegrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    DragDropModule,
    MatProgressSpinnerModule,
    GoogleChartsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    },{
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }
    , DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
