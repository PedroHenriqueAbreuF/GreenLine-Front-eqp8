import { Component, Input, inject } from '@angular/core';
import { ProdutosCardComponent } from './components/produtos-card/produtos-card.component';
import { ProdutosService } from '../../services/produtos.service';
import { Produto } from '../../models/produto';
import Swal from 'sweetalert2';
import { FooterComponent } from "../layout/footer/footer.component";
import { NavbarComponent } from "../layout/navbar/navbar.component";
import { ItemCarrinhoService } from '../../services/item-carrinho.service';
import { ItemCarrinho } from '../../models/item-carrinho';
import { Carrinho } from '../../models/carrinho';
import { LoginService } from '../../auth/login.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-produtos',
  standalone: true,
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
  imports: [ProdutosCardComponent, FooterComponent, NavbarComponent, RouterLink]
})
export class ProdutosComponent {

  lista: Produto[] = [];
  carrinhoUser: Carrinho = new Carrinho();
  itemCarrinho: ItemCarrinho = new ItemCarrinho();
  router = inject(Router);
  produtosService = inject(ProdutosService);
  itemCarrinhoService = inject(ItemCarrinhoService);
  loginService = inject(LoginService);

  listAll() {
    const userId = this.loginService.getUserIdFromToken();
    if (userId != null) {
      this.itemCarrinhoService.getCarrinhoByUser(userId).subscribe({
        next: carrinho => {
          this.carrinhoUser = carrinho || new Carrinho(); // Garante que carrinhoUser seja um objeto mesmo se vazio
        },
        error: erro => {
          Swal.fire({
            title: "ERRO",
            text: "Ocorreu um erro ao carregar o carrinho",
            icon: "error",
            confirmButtonText: 'OK',
          });
        }
      });
    }

    this.produtosService.listAll().subscribe({
      next: lista => {
        this.lista = lista;
      },
      error: erro => {
        Swal.fire({
          title: "ERRO",
          text: "Ocorreu um erro ao carregar produtos",
          icon: "error",
          confirmButtonText: 'OK',
        });
      }
    });
  }

  save(produto: Produto) {
    if (!produto || !produto.idProduto) {
      console.error('Produto ou idProduto é nulo:', produto);
      Swal.fire({
        title: 'Erro',
        text: 'Produto inválido',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (!this.loginService.getToken()) {
      Swal.fire({
        title: 'Erro',
        text: 'Para adicionar produtos, é necessário estar logado',
        icon: 'warning',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['login']);
        }
      });
      return;
    }

    let itemEncontrado = false;

    if (this.carrinhoUser?.itemCarrinho) {
      for (let i = 0; i < this.carrinhoUser.itemCarrinho.length; i++) {
        if (this.carrinhoUser.itemCarrinho[i].produto.idProduto === produto.idProduto) {
          this.itemCarrinho = this.carrinhoUser.itemCarrinho[i];
          this.itemCarrinho.quantProd += 1;

          this.itemCarrinhoService.update(this.itemCarrinho, this.itemCarrinho.idItem).subscribe({
            next: mensagem => {
              Swal.fire({
                title: mensagem,
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              this.listAll();
            },
            error: erro => {
              Swal.fire({
                title: 'Erro ao atualizar item',
                text: erro.error?.message || 'Erro desconhecido',
                icon: 'error',
                confirmButtonText: 'Ok',
              });
            }
          });
          itemEncontrado = true;
          break;
        }
      }
    }

    if (!itemEncontrado) {
      let carrinhoTemp = new Carrinho();
      carrinhoTemp.idCarrinho = this.carrinhoUser.idCarrinho;

      let itemCarrinhoTemp = new ItemCarrinho();
      itemCarrinhoTemp.carrinho = carrinhoTemp;
      itemCarrinhoTemp.quantProd = 1;
      itemCarrinhoTemp.produto = produto;

      this.itemCarrinhoService.save(itemCarrinhoTemp).subscribe({
        next: mensagem => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.listAll();
        },
        error: erro => {
          Swal.fire({
            title: 'Erro ao adicionar item ao carrinho',
            text: erro.error?.message || 'Erro desconhecido',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      });
    }
  }

  btnClicked(produto: Produto) {
    this.save(produto);
  }

  constructor() {
    this.listAll();
  }
}
