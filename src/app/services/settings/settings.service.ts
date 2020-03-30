import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  };

  constructor(@Inject(DOCUMENT) private _document, ) {

    this.cargarAjustes();

   }

  guardarAjustes() {
    // console.log('Guardado en el Local Storage');

    // Guardo en formato string
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));

  }

  cargarAjustes() {

    if ( localStorage.getItem('ajustes') ) {

      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      // console.log('Cargando del local Storage');
      this.aplicarTema(this.ajustes.tema);

    } else {
      // console.log('Usando valor por defecto');
    }
  }

  aplicarTema(tema: string) {

    const url = `assets/css/colors/${tema}.css`;
    this._document.getElementById('theme').setAttribute('href', url);

    this.ajustes.tema = tema;
    this.ajustes.temaUrl = url;

    this.guardarAjustes();

  }

}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
