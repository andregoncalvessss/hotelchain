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
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
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
      const { email, password } = this.registerForm.value;
      const { data, error } = await this.supabaseService.signUp(email, password);

      if (error) {
        console.error('Erro ao criar utilizador:', error.message);
        // Aqui podes mostrar um toast de erro
      } else {
        console.log('Utilizador criado com sucesso:', data.user);
        // ✅ Redireciona para o dashboard com navbar
        this.router.navigateByUrl('/tabs/dashboard');
      }
    } else {
      console.log('Formulário inválido');
    }
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
