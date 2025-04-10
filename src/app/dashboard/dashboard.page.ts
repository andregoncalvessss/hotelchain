import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone:false
})
export class DashboardPage {
  constructor(private router: Router) {}

  gerirQuartos() {
    // Navega para a página de quartos
    this.router.navigateByUrl('/tabs/quartos');
  }

  gerirAnomalias() {
    // Navega para a página de anomalias
    this.router.navigateByUrl('/tabs/anomalias');
  }
}