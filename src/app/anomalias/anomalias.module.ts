import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { anomaliasPage } from './anomalias.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { anomaliasPageRoutingModule} from './anomalias-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    anomaliasPageRoutingModule
  ],
  declarations: [anomaliasPage]
})
export class anomaliasPageModule {}
