import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Login } from '../../models/login';
import { LoginService } from '../../auth/login.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [FormsModule, MdbFormsModule, MdbModalModule, CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',
})
export class UsuarioComponent {
  usuarioService = inject(UsuarioService);

  cliente: Usuario = new Usuario();
  usuario: Login = new Login('', '');

  loginService = inject(LoginService);
  router = inject(Router);



  update() {
    if (this.loginService.getToken() == null) {
      alert(`Faça o login antes de atualizar`);
      this.router.navigate([`home`]);
    } else {
      this.cliente.usuario = this.usuario;

      console.log(this.cliente);

      if (this.cliente.idCliente > 0) {
        this.usuarioService.update(this.cliente, this.cliente.idCliente).subscribe({
          next: (texto) => {
            alert(texto);
            this.router.navigate(['/home']);
          },
          error: (erro) => {
            alert('ERRO A SER TRATADO!');
          },
        });
      } else {
        this.usuarioService.save(this.cliente).subscribe({
          next: (texto) => {
            alert(texto);
            this.router.navigate(['/home']);
          },
          error: (erro) => {
            alert('ERRO A SER TRATADO!');
          },
        });
      }
    }
  }

  deleteById() {
    //implementar
  }
}
