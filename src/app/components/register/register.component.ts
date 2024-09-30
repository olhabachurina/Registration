import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule] 
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = {
        username: this.registerForm.get('username')?.value,
        password: this.registerForm.get('password')?.value,
        email: this.registerForm.get('email')?.value,
        firstName: this.registerForm.get('firstName')?.value,
        lastName: this.registerForm.get('lastName')?.value,
        gender: this.registerForm.get('gender')?.value
      };
  
      this.authService.register(formData).subscribe({
        next: (response: any) => {
          if (response && response.message === 'Пользователь успешно зарегистрирован.') {
            // Авторизуем пользователя после регистрации
            this.authService.login({ username: formData.username, password: formData.password }).subscribe(() => {
              this.router.navigate(['/profile']); // Перенаправление на страницу профиля
            });
          } else {
            alert('Ошибка регистрации: ' + (response.error || 'Неизвестная ошибка'));
          }
        },
        error: (err) => {
          console.error('Ошибка регистрации:', err);
          if (err.error?.errors) {
            const validationErrors = Object.entries(err.error.errors)
              .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
              .join('\n');
            alert('Ошибки валидации:\n' + validationErrors);
          } else {
            alert('Ошибка регистрации: ' + (err.error?.message || 'Неизвестная ошибка'));
          }
        }
      });
    } else {
      alert('Пожалуйста, заполните форму корректно.');
    }
  }

  onReset() {
    this.registerForm.reset();
  }
}