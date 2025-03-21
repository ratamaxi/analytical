import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PanelComponent } from './pages/panel/panel.component';
import { BaseComponent } from './pages/base/base.component';
import { HistoryComponent } from './pages/history/history.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { ClientComponent } from './pages/client/client.component';
import { StockComponent } from './pages/stock/stock.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'panel', component: PanelComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'base', component: BaseComponent },
      { path: 'historial', component: HistoryComponent },
      { path: 'calendario', component: CalendarComponent },
      { path: 'cliente', component: ClientComponent },
      { path: 'stock', component: StockComponent },
      { path: 'configuracion', component:  ConfigurationComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }