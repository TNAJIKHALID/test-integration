import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DemoDashboardComponent} from './_user/_apprenantLibre/demo-dashboard/demo-dashboard.component';
import {DemoHomeComponent} from './_user/_apprenantLibre/demo-home/demo-home.component';
import {AuthenticationGuardService} from './_service/_guard/authentication-guard.service';
import {DemoDashGuardService} from './_service/_guard/demo-dash-guard.service';
import {PositionTestLibreComponent} from './_user/_apprenantLibre/position-test-libre/position-test-libre.component';
import {EntrainementLibreComponent} from './_user/_apprenantLibre/entrainement-libre/entrainement-libre.component';
import {EvaluationLibreComponent} from './_user/_apprenantLibre/evaluation-libre/evaluation-libre.component';
import {FormationLibreComponent} from './_user/_apprenantLibre/formation-libre/formation-libre.component';
import {LoginComponent} from './_connexion/login/login.component';
import {LoggedGuardService} from './_service/_guard/logged-guard.service';
import {TestInterfaceComponent} from './_evaluation/test-interface/test-interface.component';
import {ScoreComponent} from './_evaluation/score/score.component';
import {HomeComponent} from './_static/home/home.component';
import {ErrorComponent} from './_static/error/error.component';
import {PositionTestUpdatedComponent} from "./_evaluation/position-test-updated/position-test-updated.component";
import {PositionIntegrationComponent} from "./_demos/position-integration/position-integration.component";
import {RedirectGuardService} from "./_service/_guard/redirect-guard.service";
import {AppURLs} from "./util/URLs";
import {EntrepriseDashboradComponent} from "./_user/_entrepriseAdmin/entreprise-dashborad/entreprise-dashborad.component";
import {EntrepriseHomeComponent} from "./_user/_entrepriseAdmin/entreprise-home/entreprise-home.component";
import {AppranantLibreGuardService} from "./_service/_guard/appranant-libre-guard.service";
import {EntrepriseGuardService} from "./_service/_guard/entreprise-guard.service";
import {ProfileComponent} from "./_user/_apprenantLibre/profile/profile.component";
import {AccountSettingComponent} from "./_user/_apprenantLibre/account-setting/account-setting.component";
import {ForgotPasswordComponent} from "./_connexion/forgot-password/forgot-password.component";
import {environment} from "../environments/environment";
import {ResetPaswordCommonComponent} from "./_connexion/reset-pasword-common/reset-pasword-common.component";
import {ServerErrorComponent} from "./_static/server-error/server-error.component";
import {HabilitationsComponent} from "./_user/_entrepriseAdmin/habilitations/habilitations.component";
import {ManagePositionTestComponent} from "./_user/_entrepriseAdmin/manage-position-test/manage-position-test.component";
import {AddHabilitationComponent} from "./_user/_entrepriseAdmin/add-habilitation/add-habilitation.component";
import {TestQuestionDataBaseParamsComponent} from "./_demos/test-question-data-base-params/test-question-data-base-params.component";
import {SessionsComponent} from "./_user/_entrepriseAdmin/_demo/sessions/sessions.component";
import {PositionTestManageComponent} from "./_user/_entrepriseAdmin/_demo/position-test-manage/position-test-manage.component";
import {AddEmployeeComponent} from "./_user/_entrepriseAdmin/_demo/add-employee/add-employee.component";
import {AbonnementComponent} from "./_user/_entrepriseAdmin/static/abonnement/abonnement.component";
import {EmailsComponent} from "./_user/_entrepriseAdmin/static/emails/emails.component";
import {SupportComponent} from "./_user/_entrepriseAdmin/static/support/support.component";
import {SettingComponent} from "./_user/_entrepriseAdmin/static/setting/setting.component";
import {FacturationComponent} from "./_user/_entrepriseAdmin/static/facturation/facturation.component";
import {DownloadsComponent} from "./_user/_entrepriseAdmin/static/downloads/downloads.component";
import {AddSessionComponent} from "./_user/_entrepriseAdmin/_demo/add-session/add-session.component";

const routes: Routes = [
 // {path: '', component : HomeComponent},
  // {path: 'home', component : HomeComponent},
  {path: 'home', canActivate: [RedirectGuardService],
    component: RedirectGuardService,
    data: {
      externalUrl: AppURLs.frontEnd
    }},
  {path: '', canActivate: [RedirectGuardService],
    component: RedirectGuardService,
    data: {
      externalUrl: AppURLs.frontEnd
    }},
  {path: 'score', component : ScoreComponent, canActivate: [AuthenticationGuardService]},

  {path: 'test', component : TestInterfaceComponent},
  /* dev */
  {path: 'positionDemo', component : PositionTestUpdatedComponent},
  {path: 'pos', component : PositionIntegrationComponent},
  {path: 'NosQuestions', component : TestQuestionDataBaseParamsComponent},



  /* dev */
  {path: 'login', component : LoginComponent, canActivate: [LoggedGuardService]},
  {path: 'forgotPassword', component : ForgotPasswordComponent, canActivate: [LoggedGuardService]},
  {path: 'resetPassword/:id', component : ResetPaswordCommonComponent, canActivate: [LoggedGuardService]},


  {path: 'dashboard', component : DemoDashboardComponent, canActivate: [AuthenticationGuardService], children :[
      {path: '', component : DemoHomeComponent,canActivate: [AuthenticationGuardService,
          DemoDashGuardService,AppranantLibreGuardService]},
      {path: 'score', component : ScoreComponent, canActivate: [AuthenticationGuardService,AppranantLibreGuardService]},
      {path: 'dashUser', component : DemoHomeComponent,canActivate: [AuthenticationGuardService,AppranantLibreGuardService]},
      {path: 'positionTestLibre', component : PositionTestLibreComponent,canActivate: [AuthenticationGuardService,AppranantLibreGuardService]},
      {path: 'entrainmentLibre', component : EntrainementLibreComponent,canActivate: [AuthenticationGuardService,AppranantLibreGuardService]},
      {path: 'evaluationLibre', component : EvaluationLibreComponent,canActivate: [AuthenticationGuardService,AppranantLibreGuardService]},
      {path: 'formationLibre', component : FormationLibreComponent,canActivate: [AuthenticationGuardService,AppranantLibreGuardService]},
      {path: 'profileLibre', component : ProfileComponent,canActivate: [AuthenticationGuardService,AppranantLibreGuardService]},
      {path: 'accountSetting', component : AccountSettingComponent,canActivate: [AuthenticationGuardService,AppranantLibreGuardService]}
    ]
  },

  {path: 'dashboard-Enterprise', component : EntrepriseDashboradComponent, canActivate: [AuthenticationGuardService], children :[
      {path: '', component : EntrepriseHomeComponent,canActivate: [AuthenticationGuardService,
          DemoDashGuardService,EntrepriseGuardService]},
      {path: 'dashEnterprise', component : EntrepriseHomeComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},

      /****** Static ********/
      {path: 'abonnement', component : AbonnementComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      {path: 'emails', component : EmailsComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      {path: 'support', component : SupportComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      {path: 'parametres', component : SettingComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      {path: 'facturations', component : FacturationComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      {path: 'telelchargements', component : DownloadsComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},



      /*
      {path: 'MesSessions', component : HabilitationsComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      {path: 'PositionTest', component : ManagePositionTestComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      {path: 'addSession', component : AddHabilitationComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      */

      {path: 'MesSessions', component : SessionsComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      {path: 'PositionTest', component : PositionTestManageComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      {path: 'addSession', component : AddEmployeeComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},
      {path: 'NouvelleSession', component : AddSessionComponent,canActivate: [AuthenticationGuardService,EntrepriseGuardService]},

    ]
  },

  /*To add dashboard for another users check guards in service + url after login*/

  {path: 'error', component : ErrorComponent},
  {path: 'serverError', component : ServerErrorComponent},
  {path: '**', component : ErrorComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: environment.useHash})],
  //imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
