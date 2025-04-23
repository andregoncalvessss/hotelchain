import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'getstarted',
    loadChildren: () => import('./getstarted/getstarted.module').then(m => m.GetstartedPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'adicionar-anomalias',
    loadChildren: () => import('./adicionar-anomalias/adicionar-anomalias.module').then(m => m.AdicionarAnomaliasPageModule)
  },
  {
    path: 'anomalias',
    loadChildren: () => import('./anomalias/anomalias.module').then(m => m.AnomaliasPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
