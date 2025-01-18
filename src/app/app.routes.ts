import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { ApplicationComponent } from './application/application.component';
import { ReviewComponent } from './component/review/review.component';
import { ForwardComponent } from './forward/forward.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { SignatureComponent } from './signature/signature.component';
import { EndorsementComponent } from './endorsement/endorsement.component';
import { PaymentComponent } from './payment/payment.component';
import { DeclineComponent } from './decline/decline.component';
import { ViewApplicationDetailComponent } from './component/view-application-detail/view-application-detail.component';
import { PaidComponent } from './paid/paid.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent, children: [
      { path: 'application', component: ApplicationComponent },
      { path: 'pending', component: ReviewComponent },
      { path: 'forward', component: ForwardComponent },
      { path: 'forward/:id', component: ViewApplicationDetailComponent },
      { path: 'assessment', component: AssessmentComponent },
      { path: 'signature', component: SignatureComponent },
      { path: 'endorsement', component: EndorsementComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'reject', component: DeclineComponent },
      { path: 'paid', component: PaidComponent },
      { path: '**', redirectTo: '/application' },
    ]
  }
];
