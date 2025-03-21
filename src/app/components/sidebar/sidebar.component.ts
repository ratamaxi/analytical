import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GYM_ROUTES_CONFIG } from 'src/app/interface/sidebar-config.constants';
import { SidebarConfig } from 'src/app/interface/sidebar.interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]

})
export class SidebarComponent {
  public navigationItems: SidebarConfig[] = GYM_ROUTES_CONFIG;

}
