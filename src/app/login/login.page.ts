import { Component, OnInit } from '@angular/core';
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
    private loadingCtrl: LoadingController
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

    const { email, password } = this.loginForm.value;
    const { error, data } = await this.supabaseService.signIn(email, password);

    await loading.dismiss();

    // Debug (opcional): ver o que o Supabase retorna
    console.log('DATA:', data);
    console.log('SESSION:', data?.session);
    console.log('USER:', data?.user);
    
    if (error) {
      this.presentToast('Credenciais inválidas. Tenta novamente.', 'danger');
      return;
    }

    this.presentToast('Bem-vindo!', 'success');
    this.router.navigateByUrl('/tabs/dashboard');
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
