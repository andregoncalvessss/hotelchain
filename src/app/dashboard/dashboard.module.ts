import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard.page'; // Atualizado para o novo nome da página
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { DashboardPageRoutingModule } from './dashboard-routing.module'; // Corrigido o nome do módulo de roteamento

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    DashboardPageRoutingModule // Corrigido o nome do módulo de roteamento
  ],
  declarations: [DashboardPage] // Atualizado para o novo nome da página
})
export class DashboardPageModule {}