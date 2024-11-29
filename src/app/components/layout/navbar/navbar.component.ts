import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { LoginService } from '../../../auth/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MdbCollapseModule, MdbDropdownModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  loginService = inject(LoginService);
  router = inject(Router);

  actionsNav = [
    {
      text: "GREEN PRODUTOS",
      icon: 'fa-biohazard',
      url: 'produto',
      isExternal: false
    },
    {
      text: "SERVIÇOS",
      icon: 'fa-tools',
      url: 'produto',
      isExternal: false
    }
  ];

  actionsCategoria = [
    {
      text: "Placa de Video",
      url: '#',
      isExternal: false
    },
    {
      text: "Processador",
      url: '#',
      isExternal: false
    },
    {
      text: "Placa Mãe",
      url: '#',
      isExternal: false
    }
  ];

  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  // Obtém o papel do usuário
  getUserRole(): string | null {
    return this.loginService.getRole();
  }

  // Executa o logout e redireciona para a página de login
  logout(): void {
    this.loginService.removerToken();
    this.router.navigate(['login']);
  }
}
