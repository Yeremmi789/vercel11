import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IddServicesService } from 'src/app/service/idd-services.service';

declare var YT: any;



@Component({
  selector: 'app-edit-curso-id',
  templateUrl: './edit-curso-id.component.html',
  styleUrls: ['./edit-curso-id.component.css']
})
export class EditCursoIdComponent implements OnInit{

  
  id:any
  editCurso:any;
  objetivos:any;
  seccions:any;
  formNewimg: FormGroup;
  NewobjetivoCUrsos: FormGroup;
  NewSeccionCUrsos: FormGroup;
  file: any;
  formdata= new FormData();
  datosCursosUpdate: FormGroup;
  seccionesDeCurso:FormGroup;
  typerECURSO:any;
  formdataUpdateUser= new FormData();
  private player: any;

  


  constructor(
    private activeRouter:ActivatedRoute,        
    private dataService: IddServicesService,
    public formulario:FormBuilder,
  ) { 
    this.NewSeccionCUrsos=this.formulario.group({      
      nombre:['', [Validators.required,Validators.maxLength(210), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i),]],      
      descripcion:['', [Validators.required,Validators.maxLength(210), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i),]],      
      url:['', [Validators.required,Validators.maxLength(210), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i),]],      
      id_curso:['', [Validators.required,Validators.maxLength(210), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i),]],      
    })
    this.NewobjetivoCUrsos=this.formulario.group({      
      objetivo:['', [Validators.required,Validators.maxLength(210), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i),]],      
    })
    this.formNewimg=this.formulario.group({      
      file:[null, [Validators.required]],
    })    
    this.datosCursosUpdate=this.formulario.group({      
      name:['', [Validators.required,Validators.maxLength(30), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i),]],
      Descripcion:['', [Validators.required, Validators.maxLength(160),Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
      tipo:['', [Validators.required]],
      precio:['', [Validators.required, Validators.pattern(/^[0-9]+$/i)]],
      tipyRec:['', [Validators.required]],      
    })
    this.seccionesDeCurso=this.formulario.group({      
      nombre:['', [Validators.required,Validators.maxLength(30), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i),]],
      descripcion:['', [Validators.required, Validators.maxLength(160),Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
      url:['', [Validators.required]],      
    })
  }  

  onReady(event: YT.PlayerEvent) {
    // Manejar el evento 'ready' del reproductor
  }

  onChange(event: YT.PlayerEvent) {
    // Manejar el evento 'change' del reproductor
  }

  onStateChange(event: YT.OnStateChangeEvent) {
    // Manejar el evento 'stateChange' del reproductor
  }

  onError(event: YT.OnErrorEvent) {
    // Manejar el evento 'error' del reproductor
  }

  ngOnInit(): void {
    this.id=this.activeRouter.snapshot.paramMap.get('id')  
    const apiKey = 'AIzaSyBEWYjQFO5aPqqgx3MR-XHS1dXrwBXBQgg';

   this.loadYoutubeApi(apiKey)

   
    this.dataService.getTypeRecursos().subscribe(res=>{
      this.typerECURSO=res
    })
    
    this.datosActualizadosUsuario()
  
    this.dataService.showObejtivoCursoId({id_curso:this.id}).subscribe(res=>{
      console.log(res)
      this.objetivos=res
    })   
    this.obtenerSeccionesCursoId()
  }

  loadYoutubeApi(apiKey: string): void {
    // Carga la API de YouTube
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';

    tag.onload = () => {
      YT.ready(() => {
        this.player = new YT.Player('player', {
          height: '360',
          width: '640',
          videoId: 'ciXG_H1vKMs', // Reemplaza con el ID del video de YouTube
          playerVars: {
            'autoplay': 1, // Cambia a 1 para reproducir automáticamente
            'controls': 1, // Muestra los controles del reproductor
            'rel': 1, // Evita mostrar videos relacionados al final
            'showinfo': 0, // Oculta información adicional del video
          }
        });
      
      });
    };

    document.body.appendChild(tag);
  }

 

  datosActualizadosUsuario(){
    this.dataService.getrecurosEditId(this.id).subscribe(res=>{
      this.editCurso=res           
      this.datosCursosUpdate.setValue({
        name: this.editCurso.nombre,
        Descripcion: this.editCurso.Descripcion,
        tipo: '',
        precio: this.editCurso.precio,
        tipyRec: this.editCurso.tipyRec,        
      });      
    })
  }

  imagensXD(){
    if(this.formNewimg.valid){    
      this.dataService.vistapreviaCurso(this.id,this.formdata).subscribe(res=>{
        let arr = Object.entries(res);
        alert(arr[0][1]+ ', actualiza la pagina')
        this.dataService.getrecurosEditId(this.id).subscribe(res=>{
          this.editCurso=res
          console.log(res)
        })
      })
    }else{
      alert('Debes subir una imagen')    
    }    
  }


  imagenUp(event:any){      
    this.file=event.target.files[0];    
    this.formdata.append("file", this.file, this.file.name)
    console.log(this.formdata)   
  }

  actualizarDatos(){
    if(!this.datosCursosUpdate.valid){
      return alert("llene los datos correctamente")      
    }

    this.dataService.updateCursoUserId(this.id, this.datosCursosUpdate.value).subscribe(res=>{
      let arr = Object.entries(res);
        
      if(arr[0][0] == "success"){
        alert("Actualizado con exito")
        this.datosActualizadosUsuario()
      }else{
        alert(arr[0][1])
      }

    })

    
  }

  obtenerSeccionesCursoId(){
    this.dataService.seccioneCursoId(this.id).subscribe(res=>{
      this.seccions=res
      console.log(res)
    })
  }


  get name(){ return this.datosCursosUpdate.get('name');}
  get Descripcion(){ return this.datosCursosUpdate.get('Descripcion');}
  get tipo(){ return this.datosCursosUpdate.get('tipo');}
  get precio(){ return this.datosCursosUpdate.get('precio');}    
  get tipyRec(){ return this.datosCursosUpdate.get('tipyRec0');}


  get nombre(){ return this.datosCursosUpdate.get('nombre');}
  get descripcion(){ return this.datosCursosUpdate.get('descripcion');}
  get url(){ return this.datosCursosUpdate.get('url');}
}
