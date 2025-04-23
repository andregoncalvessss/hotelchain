import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async login() {
    if (!this.loginForm.valid) {
      this.presentToast('Preenche todos os campos corretamente.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'A verificar credenciais...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const { email, password } = this.loginForm.value;
      const { error, data } = await this.supabaseService.signIn(email, password);

      await loading.dismiss();

      // Debug: ver resposta do Supabase
      console.log('LOGIN RESPONSE:', { error, data });
      
      if (error) {
        this.presentToast('Credenciais inválidas. Tenta novamente.', 'danger');
        return;
      }

      // Login bem-sucedido
      this.presentToast('Bem-vindo!', 'success');
      
      // Navegar para a tab de dashboard com timeout para garantir que o toast seja exibido primeiro
      setTimeout(() => {
        console.log('Navegando para dashboard após login...');
        // Navegar para a rota raiz que deve carregar as tabs
        window.location.href = '/';
      }, 1000);
    } catch (e) {
      await loading.dismiss();
      console.error('Erro durante login:', e);
      this.presentToast('Erro ao fazer login. Verifique o console para detalhes.', 'danger');
    }
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  irParaRegisto() {
    this.router.navigate(['/register']);
  }
}
