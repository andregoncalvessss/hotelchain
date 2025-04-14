import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnomaliasPage } from './anomalias.page';

const routes: Routes = [
  {
    path: '',
    component: AnomaliasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnomaliasPageRoutingModule {}
