import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-accout-settings',
  templateUrl: './accout-settings.component.html',
  styles: []
})
export class AccoutSettingsComponent implements OnInit {

  // Esta instruccion es para hacer referencia al documento fuera de la app.a
  // Manipular el index.html
  constructor( public _ajustes: SettingsService ) { }

  ngOnInit() {

    this.colocarCheck();

  }

  cambiarColor( tema: string, link: any ) {
    console.log('tema: ', tema);
    console.log('link: ', link);

    this.aplicarCheck( link );

    this._ajustes.aplicarTema( tema );

  }

  aplicarCheck( link: any ) {

    const selectores: any = document.getElementsByClassName('selector');
    
    for (const ref of selectores) {
      ref.classList.remove('working');
    }
    
    link.classList.add('working');
    
  }
  
  colocarCheck() {

    const selectores: any = document.getElementsByClassName('selector');

    let tema = this._ajustes.ajustes.tema;

    for (const ref of selectores) {
      if( ref.getAttribute('data-theme') === tema ) {
        ref.classList.add('working');
        break;
      }
    }

  }
  



}
