import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { anomaliasPage } from './anomalias.page';
import { an } from '@angular/router/router_module.d-6zbCxc1T';

const routes: Routes = [
  {
    path: '',
    component: anomaliasPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class anomaliasPageRoutingModule {}
