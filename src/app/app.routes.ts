import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { ApplicationComponent } from './application/application.component';
import { ReviewComponent } from './component/review/review.component';
import { ForwardComponent } from './forward/forward.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { SignatureComponent } from './signature/signature.component';
import { EndorsementComponent } from './approval/endorsement.component';
import { DeclineComponent } from './decline/decline.component';
import { ViewApplicationDetailComponent } from './component/view-application-detail-accounting/view-application-detail.component';
import { PaidComponent } from './paid/paid.component';
import { ViewApplicationDetailComponentApplication } from './component/view-application-detail-application/view-application-detail-application.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent, children: [
      { path: 'application', component: ApplicationComponent },
      { path: 'pending', component: ReviewComponent },
      { path: 'forward', component: ForwardComponent },
      { path: 'forward/:id', component: ViewApplicationDetailComponent },
      { path: 'application/:id', component: ViewApplicationDetailComponentApplication },
      { path: 'assessment', component: AssessmentComponent },
      { path: 'signature', component: SignatureComponent },
      { path: 'approval', component: EndorsementComponent },
      { path: 'reject', component: DeclineComponent },
      { path: 'done', component: PaidComponent },
      { path: '**', redirectTo: '/login' },
    ]
  }
];
