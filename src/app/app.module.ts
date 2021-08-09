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
import {DatePipe, PercentPipe} from '@angular/common';
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
import {ConfirmationDialogComponent} from './_static/confirmation-dialog/confirmation-dialog.component';
import {PositionTestUpdatedComponent} from "./_evaluation/position-test-updated/position-test-updated.component";
import { PositionIntegrationComponent } from './_demos/position-integration/position-integration.component';
import {ToastrModule} from "ngx-toastr";
import {MatSidenavModule} from "@angular/material/sidenav";
import {IpListModule} from "./_service/_localisation/iplist";
import {NgxDocViewerModule} from "ngx-doc-viewer";
import {RedirectGuardService} from "./_service/_guard/redirect-guard.service";
import { EntrepriseDashboradComponent } from './_user/_entrepriseAdmin/entreprise-dashborad/entreprise-dashborad.component';
import { EntrepriseHomeComponent } from './_user/_entrepriseAdmin/entreprise-home/entreprise-home.component';
import {
    NgbAlertModule,
    NgbDatepickerModule,
    NgbDropdownModule, NgbPaginationModule,
    NgbToastModule,
    NgbTooltipModule
} from "@ng-bootstrap/ng-bootstrap";
import { ProfileComponent } from './_user/_apprenantLibre/profile/profile.component';
import { AccountSettingComponent } from './_user/_apprenantLibre/account-setting/account-setting.component';
import { ForgotPasswordComponent } from './_connexion/forgot-password/forgot-password.component';
import { ResetPaswordCommonComponent } from './_connexion/reset-pasword-common/reset-pasword-common.component';
import { ServerErrorComponent } from './_static/server-error/server-error.component';
import { HabilitationsComponent } from './_user/_entrepriseAdmin/habilitations/habilitations.component';
import { ManagePositionTestComponent } from './_user/_entrepriseAdmin/manage-position-test/manage-position-test.component';
import {DataTablesModule} from "angular-datatables";
import { HabilitationComponent } from './_user/_entrepriseAdmin/habilitation/habilitation.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { AddHabilitationComponent } from './_user/_entrepriseAdmin/add-habilitation/add-habilitation.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatExpansionModule} from "@angular/material/expansion";
import { TestQuestionDataBaseComponent } from './_demos/test-question-data-base/test-question-data-base.component';
import { TestQuestionDataBaseParamsComponent } from './_demos/test-question-data-base-params/test-question-data-base-params.component';
import { SessionsComponent } from './_user/_entrepriseAdmin/_demo/sessions/sessions.component';
import { PositionTestManageComponent } from './_user/_entrepriseAdmin/_demo/position-test-manage/position-test-manage.component';
import { AddEmployeeComponent } from './_user/_entrepriseAdmin/_demo/add-employee/add-employee.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { SettingComponent } from './_user/_entrepriseAdmin/static/setting/setting.component';
import { SupportComponent } from './_user/_entrepriseAdmin/static/support/support.component';
import { EmailsComponent } from './_user/_entrepriseAdmin/static/emails/emails.component';
import { DownloadsComponent } from './_user/_entrepriseAdmin/static/downloads/downloads.component';
import { FacturationComponent } from './_user/_entrepriseAdmin/static/facturation/facturation.component';
import { AbonnementComponent } from './_user/_entrepriseAdmin/static/abonnement/abonnement.component';
import { AddSessionComponent } from './_user/_entrepriseAdmin/_demo/add-session/add-session.component';
import { OneSessionComponent } from './_user/_entrepriseAdmin/_demo/one-session/one-session.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { CartesComponent } from './_user/_entrepriseAdmin/static/cartes/cartes.component';
import { HistoriqueComponent } from './_user/_entrepriseAdmin/static/historique/historique.component';
import { PayementComponent } from './_user/_entrepriseAdmin/static/payement/payement.component';
import {MatListModule} from "@angular/material/list";
import {MY_DATE_FORMATS} from "./util/formats";
import { OneEmlpoyeeComponent } from './_user/_entrepriseAdmin/_demo/one-emlpoyee/one-emlpoyee.component';


@NgModule({
  declarations: [
    AppComponent,
    FormatTimePipe,
    LoginComponent,
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
    PositionIntegrationComponent,
    EntrepriseDashboradComponent,
    EntrepriseHomeComponent,
    ProfileComponent,
    AccountSettingComponent,
    ForgotPasswordComponent,
    ResetPaswordCommonComponent,
    ServerErrorComponent,
    HabilitationsComponent,
    ManagePositionTestComponent,
    HabilitationComponent,
    AddHabilitationComponent,
    TestQuestionDataBaseComponent,
    TestQuestionDataBaseParamsComponent,
    SessionsComponent,
    PositionTestManageComponent,
    AddEmployeeComponent,
    SettingComponent,
    SupportComponent,
    EmailsComponent,
    DownloadsComponent,
    FacturationComponent,
    AbonnementComponent,
    AddSessionComponent,
    OneSessionComponent,
    CartesComponent,
    HistoriqueComponent,
    PayementComponent,
    OneEmlpoyeeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
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
    MatSnackBarModule,
    MatSidenavModule,

    IpListModule,
    NgxDocViewerModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbDatepickerModule,

    DataTablesModule,
    MatCheckboxModule,
    MatStepperModule,
    MatExpansionModule,
    NgbToastModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbAlertModule,
    MatSlideToggleModule,
    NgbPaginationModule,
    MatListModule
  ],
  providers: [
    RedirectGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    },{
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }
    , DatePipe,
    PercentPipe,
    FormatTimePipe,
    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
