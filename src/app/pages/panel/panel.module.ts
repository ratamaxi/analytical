import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { PanelComponent } from './panel.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';


@NgModule({
  declarations: [PanelComponent],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
  ],
  exports: [PanelComponent]
})
export class PanelControlModule { }
