import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recordarme: boolean = false;

  auth2: any;

  constructor(   
    public router: Router, 
    public usuarioService: UsuarioService
  ) { }

  ngOnInit() {

    this.googleInit();

    // recuepero email del localStorage
    this.email = localStorage.getItem('email') || '';
    if ( this.email.length > 1 ) {
      this.recordarme = true;
    }
  }

  googleInit(){
    // Documentacion: https://developers.google.com/identity/sign-in/web/listeners
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        clienn_id: '43151423621-c03qu8vve6n5palu4un5quamfe957e4u.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin( document.getElementById('btnGoogle'));

    });
  }

  attachSignin( element ) {
    this.auth2.attachClickHandler( element, {}, googleUser =>{
      // Obtiene el perfil de usuario
      // let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;
      
      this.usuarioService.loginGoogle( token )
        // .subscribe( resp => this.router.navigate([ '/dashboard'])); --> se cambio por NgZone
        // .subscribe(() => this.ngZone.run(() => this.router.navigate(['/dashboard'])) );
        .subscribe(() => {
          window.location.href='/dashboard'
          this.auth2.disconnect();
        });

        /**
         * La navegación es activada fuera de la zona de angular, por lo que se sugiere inyectar el servicio NgZone.
         * Warming:Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'
        */
      
    });
  }

  ingresar( forma: NgForm ) {

    if ( forma.invalid ) {
      return
    }

    let usuario = new Usuario( null, forma.value.email, forma.value.password );

    this.usuarioService.login( usuario, forma.value.recordarme )
      .subscribe( correcto => this.router.navigate([ '/dashboard']));

    console.log(forma.valid);
    console.log(forma.value);
    
    
    // this.router.navigate([ '/dashboard']);
  }

}
