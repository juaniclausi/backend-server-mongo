import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( 
    public http: HttpClient,
    public router: Router      
  ) { 
    this.cargarStorage();
    console.log('Servicio de usuario listo');
  }

  estaLogueado(){
    // Retorno un true o un false si esta logueado o no.
    return ( this.token.length > 5 ) ? true : false;
  }
  
  cargarStorage() {

    // Se usa para iniciarlizar los valores usuario y token siempre que se llama 
    //el servicio para poder usarlo en los otros servicios del login

    if (localStorage.getItem('token')) {
    
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    
    } else {
    
      this.token = '';
      this.usuario = null;
    
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {

    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );

    this.usuario = usuario;
    this.token = token;
  }

  logOut(){

    this.usuario = null;
    this.token = '';
    
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');    
    localStorage.clear

    this.router.navigate(['/login']);

   
  }

  loginGoogle( token: string ) {
  
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token })
      .map( (resp: any) => {

        this.guardarStorage( resp.id, resp.token, resp.usuario );

        return true;
        
      });

  }

  login( usuario: Usuario, recordar: boolean = false ) {
    
    if (recordar) {
      localStorage.setItem('email', usuario.email);      
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';

    return this.http.post( url, usuario )
      .map( (resp: any) => {

        this.guardarStorage( resp.id, resp.token, resp.usuario );

        return true;
      })

  }

  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    // Pongo return para subscribirme a un observador
    return this.http.post(url, usuario)
    .map((resp: any) => {
            swal.fire('Usuario creado', usuario.email, 'success');
            return resp.usuario;
        });

  }
}
