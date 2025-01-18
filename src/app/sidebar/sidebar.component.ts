import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItemComponent } from '../component/menu-item/menu-item.component';
import { AuthService } from '../service/auth/auth.service';
import { UserService } from '../service/user.service';
import { StaffProfile, UserProfile } from '../interface';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, MenuItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  userProfile!: StaffProfile

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService

  ) {
    this.userService.userProfile$.subscribe(
      res => {
        this.userProfile = res
      }
    )
  }

  get parseUsername() {

    return this.userProfile.first_name + ' ' +
      (this.userProfile.middle_name ? this.userProfile.middle_name : '')
      + ' ' +
      this.userProfile.last_name
      + ' ' +
      (this.userProfile.ext_name ? this.userProfile.ext_name : '')
  }

  paths = [
    "application",
    "pending",
    "forward",
    "assessment",
    "signature",
    "endorsement",
    "payment",
    "reject",
    "paid"
  ]

  logout(): void {
    this.authService.flushToken()
    this.router.navigate(['/login']);
  }
}
