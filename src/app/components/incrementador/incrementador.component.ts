import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  // Referencia a un elemento HTML
  @ViewChild('txtProgress') txtProgress: ElementRef;


  // @Input, variables que pueden venir de afuera.
  // tslint:disable-next-line: no-input-rename
  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  // Sintaxis para emitir un numero como un evento
  // tslint:disable-next-line: no-output-rename
  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {
    console.log('Leyenda', this.leyenda);
    console.log('Progreso', this.progreso);
  }

  ngOnInit() {
  }

  onChange(newValue: number) {


    // Restrinjo el input para que no pueda poner valores fuera de entre 0 y 100
    // El getElementsByName me devuelve un array de todos los elementos que encuentre
    // Por eso uso la posicion 0 que es el input
    // const elemHTML: any = document.getElementsByName('progreso')[0];
    // console.log('elemHTML', elemHTML.value);

    console.log('txtProgress', this.txtProgress);

    // En vez de usar javaScript puro uso el ViewChild para referenciar al elemento,
    // que me devuelve un objeto con el elemento referenciado.
    const elemHTML: any = this.txtProgress;

    if (newValue >= 100) {
      this.progreso = 100;
    } else if (newValue <= 0 ) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    elemHTML.value = this.progreso;
    this.cambioValor.emit(this.progreso);
  }

  cambiarValor(valor: number) {

    this.progreso += valor;

    if (this.progreso >= 100) {
      this.progreso = 100;
    }

    if (this.progreso <= 0) {
      this.progreso = 0;
    }

    this.cambioValor.emit(this.progreso);

    // Hacer foco en un elemento HTML
    this.txtProgress.nativeElement.focus();

  }


}
