import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Autenticador } from '../../../auth/autenticador';
import { LoginService } from '../../../auth/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent {
  loginData: Autenticador = new Autenticador();
  erroLogin: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {
    loginService.removerToken(); // Remove o token anterior ao iniciar o login
  }

  logar() {
    this.loginService.login(this.loginData).subscribe({
      next: response => {
        Swal.fire({
          title: 'Bem vindo',
          icon: 'success',
          confirmButtonText: 'Ok',
        });

        this.loginService.addToken(response.access_token); // Salva o token no serviço de login
        this.router.navigate(['home']); // Redireciona para a página inicial ou desejada
      },
      error: () => {
        Swal.fire({
          title: 'Ocorreu um erro, login inexistente',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    });
  }
}
