import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { PagesComponent } from './pages.component';
import { PanelControlModule } from './panel/panel.module';


@NgModule({
  declarations: [
    PagesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppRoutingModule,
    PanelControlModule
  ],
  exports:[PagesComponent]
})
export class PagesModule { }
