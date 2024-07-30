import {Component, OnInit} from '@angular/core';
import {CarritoService} from "./carrito.service";
import {DataSharingService} from "./data-sharing.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'e-commerce-angular-node';
  public productos = [];
  private adminPassword = 'EmprendeMarketAdmin';

  constructor(
    private carritoService: CarritoService,
    private dataSharingService: DataSharingService,
    private router: Router
  ) {
    // Comunicación entre componentes
    this.dataSharingService.currentMessage.subscribe(mensaje => {
      if (mensaje == "car_updated") {
        this.refrescarCarrito();
      }
    })
  }

  public async refrescarCarrito() {
    this.productos = await this.carritoService.obtenerProductos();
  }

  public total() {
    // Quién te conoce reduce
    let total = 0;
    this.productos.forEach(p => total += p.precio);
    return total;
  }

  ngOnInit(): void {
    this.refrescarCarrito();
  }

  public verificarAdmin(seccion: string) {
    const password = prompt('Ingrese la contraseña de administrador para acceder a esta sección:');
    if (password === this.adminPassword) {
      this.router.navigate([`/${seccion}`]);
    } else {
      alert('Contraseña incorrecta. No tiene permiso para acceder a esta sección.');
    }
  }
}
