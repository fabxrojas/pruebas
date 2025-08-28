
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { EmpresasxModulo, Login } from '../../model/Login';
import { DropdownModule } from 'primeng/dropdown';
import { GlobalService } from '../../service/global.service';
import { verMensajeInformativo } from '../utilities/funciones_utilitarias';
import { ConfigService } from '../../service/config.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ToastModule, CommonModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, CheckboxModule, RouterModule, FormsModule,DropdownModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
    credencialesFRM:FormGroup;
    errorMessage: string = '';
    showDialog: boolean = false;
    recordarme: boolean = false;
    dialogMessage: string = '';
    Empresa:EmpresasxModulo[]=[]
    selectedEmpresa: string = '';

    // Constructor que inicializa el formulario 
    constructor(private globalservice:GlobalService,private fb:FormBuilder,
        // Inyeccion de dependencias
        private LoginServicio:LoginService, private router:Router,
        private messageService:MessageService, private link:Router, private configService: ConfigService){
        // Inyeccion de dependencias
            this.credencialesFRM=fb.group({
            nombreusuario:['',[Validators.required,Validators.maxLength(50)]], // Campo requerido y con maximo de 50 caracteres
            claveusuario: ['',[Validators.required,Validators.maxLength(50)]],
            codigoempresa:['',[Validators.required,Validators.maxLength(50)]],

        });
    }
    ngOnInit(): void {
        // Verifica si el usuario ya está autenticado
        this.LoginServicio.isAuthenticated().subscribe(isAuthenticated => {
            if (isAuthenticated) {
                this.link.navigate(['/Home']);
            } else{
                this.link.navigate(['/'])
            }
        });

        const savedUser = localStorage.getItem('rememberedUser');
        if (savedUser) {
            const { nombreusuario, claveusuario, codigoempresa } = JSON.parse(savedUser);
            this.credencialesFRM.patchValue({ nombreusuario, claveusuario, codigoempresa });
            this.recordarme = true;
        }
        this.loadEmpresa()
    }

    //Método para manejar el envió del form
    iniciarSesion(){
        if(this.credencialesFRM.valid){
            // Si el formulario es válido, se procede con la autenticación
            const autenticacion: Login = this.credencialesFRM.value;
            this.LoginServicio.autenticacion(autenticacion).subscribe({
                    // next: permite manejar la respuesta exitosa
                    next:  (response)=>{
                        // Si la autenticación es exitosa, se guarda el nombre de usuario y el código de empresa
                        if(response.isSuccess){
                            this.globalservice.setNombreUsuario(autenticacion.nombreusuario)
                            this.globalservice.setCodigoEmpresa(autenticacion.codigoempresa)
                            // Si la autenticación es exitosa, se guarda el código de perfil
                            this.globalservice.setCodigoPerfil(response.data[0].codigoPerfil);

                             console.log("autenticacion exitosa");
                            // console.log(this.globalservice.getCodigoPerfil());

                            this.router.navigate(['/Home']);
                            if (this.recordarme) {
                               localStorage.setItem('rememberedUser', JSON.stringify({
                                   nombreusuario: autenticacion.nombreusuario,
                                   claveusuario: autenticacion.claveusuario,
                                   codigoempresa: autenticacion.codigoempresa,
                               }));
                           } else {
                               localStorage.removeItem('rememberedUser');
                           }
                        } else{
                            console.log("Error en autenticaion");
                            console.log(response);
                            verMensajeInformativo(this.messageService,'error', 'Credenciales inválidas', 'Usuario y/o clave incorrecta');

                        }

                    }, error:(error) =>{
                        verMensajeInformativo(this.messageService, 'error', 'Credenciales invalidas','Usuario y/o clave incorrecta');

                    }
                });
        } else {
            // Si el formulario no es válido, mostrar un mensaje de advertencia
            verMensajeInformativo(this.messageService, 'warn', 'Campos incompletos', 'Por favor completa los campos correctamente.');
        }
    }

    loadEmpresa(){
        // Cargar las empresas disponibles
        const codigomodulo = this.configService.getCodigoModulo() // Permite obtener el código del módulo
        this.LoginServicio.getEmpresa(codigomodulo).subscribe( // Permite obtener las empresas del módulo
            (data:EmpresasxModulo[])=>{ // Permite obtener las empresas del módulo
                this.Empresa = data; // hace referencia a las empresas del módulo

                if(this.selectedEmpresa){
                    // Si hay una empresa seleccionada, buscarla en la lista de empresas
                    const empresaEncontrada=this.Empresa.find(p=>p.codigomodulo===this.selectedEmpresa);
                    // console.log(data);
                }
            }
        )
    }

    // Método para manejar el cambio de empresa
    onEmpresaChallenge(event:any){ // event: any hace referencia al evento de cambio
        console.log("onEmpresaChallenge");
        // Actualiza el formulario con el código de la empresa seleccionada
        this.credencialesFRM.patchValue({
            // Este codigo actualiza el campo codigoempresa
            codigoempresa: event.value
            
        });
        
        console.log(event.value);
    }

}
