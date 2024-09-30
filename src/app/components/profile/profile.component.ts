import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule] 
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required]
    });
  } 

  ngOnInit() {
    // Загрузка профиля пользователя
    this.authService.getProfile().subscribe({
      next: (data) => this.profileForm.patchValue(data), // Патчим значения в форму
      error: (err) => alert('Ошибка загрузки данных: ' + err)
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.authService.updateProfile(this.profileForm.getRawValue()).subscribe({
        next: () => alert('Данные успешно обновлены!'),
        error: (err) => alert('Ошибка обновления данных: ' + err)
      });
    }
  }
}