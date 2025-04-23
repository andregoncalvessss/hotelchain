import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    if (!confirm) return { required: true };

    return password === confirm ? null : { passwordMismatch: true };
  }

  async submit() {
    if (this.registerForm.valid) {
      const { email, password, firstName, lastName } = this.registerForm.value;

      try {
        const loading = await this.loadingCtrl.create({
          message: 'Creating account...',
          spinner: 'crescent'
        });
        await loading.present();

        // Chama o método signUp
        const { data, error } = await this.supabaseService.signUp(
          email,
          password,
          firstName,
          lastName
        );

        await loading.dismiss();

        if (error) {
          console.error('Error during registration:', error.message);
          this.presentToast('Error creating account: ' + error.message, 'danger');
        } else {
          console.log('User registered successfully:', data);
          this.presentToast('Account created successfully!', 'success');
          this.router.navigateByUrl('/tabs/dashboard');
        }
      } catch (e) {
        console.error('Unexpected error during registration:', e);
        this.presentToast('An unexpected error occurred', 'danger');
      }
    } else {
      console.log('Invalid form');
      this.presentToast('Please fill in all required fields correctly', 'warning');
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

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
