import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuartoPage } from './quartos.page';

const routes: Routes = [
  {
    path: '',
    component: QuartoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuartosPageRoutingModule {}