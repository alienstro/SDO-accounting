import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItemComponent } from '../component/menu-item/menu-item.component';

import { CommonModule } from '@angular/common';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  firstName!: string;
  lastName!: string;
  department_id!: any;

  constructor(
    private router: Router,
    private tokenService: TokenService

  ) {
    this.firstName = this.tokenService.firstNameToken(this.tokenService.decodeToken());
    this.lastName = this.tokenService.lastNameToken(this.tokenService.decodeToken());
    this.department_id = this.tokenService.userRoleToken(this.tokenService.decodeToken());

    console.log("department id: ", this.department_id)
  }

  // paths = [
  //   "application",
  //   "pending",
  //   "forward",
  //   "assessment",
  //   "signature",
  //   "endorsement",
  //   "payment",
  //   "reject",
  //   "paid"
  // ]

  paths = [
    "application",
    "signature",
    "forward",
    "approval",
    "pending",
    "done",
    "reject",
  ]

  logout(): void {
    this.tokenService.flushToken()
    this.router.navigate(['/login']);
  }
}
