import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdicionarAnomaliasPageRoutingModule } from './adicionar-anomalias-routing.module';

import { AdicionarAnomaliasPage } from './adicionar-anomalias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdicionarAnomaliasPageRoutingModule
  ],
  declarations: [AdicionarAnomaliasPage]
})
export class AdicionarAnomaliasPageModule {}
