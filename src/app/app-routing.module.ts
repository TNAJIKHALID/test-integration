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

const routes: Routes = [
  {path: '', component : HomeComponent},
  {path: 'home', component : HomeComponent},
  {path: 'score', component : ScoreComponent, canActivate: [AuthenticationGuardService]},

  {path: 'test', component : TestInterfaceComponent},
  /* dev */
  {path: 'positionDemo', component : PositionTestUpdatedComponent},
  {path: 'pos', component : PositionIntegrationComponent},
  /* dev */
  {path: 'login', component : LoginComponent, canActivate: [LoggedGuardService]},


  {path: 'testDashboard', component : DemoDashboardComponent, canActivate: [AuthenticationGuardService], children :[
      {path: '', component : DemoHomeComponent,canActivate: [AuthenticationGuardService,
          DemoDashGuardService]},
      {path: 'score', component : ScoreComponent, canActivate: [AuthenticationGuardService],data: {animation: 'AboutPage'}},
      {path: 'dashUser', component : DemoHomeComponent,canActivate: [AuthenticationGuardService]},
      {path: 'positionTestLibre', component : PositionTestLibreComponent,canActivate: [AuthenticationGuardService],data: {animation: 'AboutPage'}},
      {path: 'entrainmentLibre', component : EntrainementLibreComponent,canActivate: [AuthenticationGuardService],data: {animation: 'HomePage'}},
      {path: 'evaluationLibre', component : EvaluationLibreComponent,canActivate: [AuthenticationGuardService],data: {animation: 'HomePage'}},
      {path: 'formationLibre', component : FormationLibreComponent,canActivate: [AuthenticationGuardService],data: {animation: 'HomePage'}},
    ]
  },

  {path: 'dashboard', component : DemoDashboardComponent, canActivate: [AuthenticationGuardService], children :[
      {path: '', component : DemoHomeComponent,canActivate: [AuthenticationGuardService,
          DemoDashGuardService]},
      {path: 'dashUser', component : DemoHomeComponent,canActivate: [AuthenticationGuardService]},
      {path: 'positionTestLibre', component : PositionTestLibreComponent,canActivate: [AuthenticationGuardService]},
      {path: 'entrainmentLibre', component : EntrainementLibreComponent,canActivate: [AuthenticationGuardService]},
      {path: 'evaluationLibre', component : EvaluationLibreComponent,canActivate: [AuthenticationGuardService]},
      {path: 'formationLibre', component : FormationLibreComponent,canActivate: [AuthenticationGuardService]},
    ]
  },
  {path: 'error', component : ErrorComponent},
  {path: '**', component : ErrorComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
