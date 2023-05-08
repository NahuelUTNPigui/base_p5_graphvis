import { NgStyle } from '@angular/common';
import {saveAs} from "file-saver";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

import * as  p5 from 'p5';

// ME SIRVEN
//https://editor.p5js.org/jsarachan/sketches/ry8TEc_0b
//https://editor.p5js.org/shiuheng/sketches/ghtlplGgf
//https://observablehq.com/@floran-hachez/vega-lite-pie-chart
//https://stackoverflow.com/questions/59240171/p5-js-random-colors-and-save-as-pdf-function
//https://stackoverflow.com/questions/42850260/property-todataurl-does-not-exist-on-type-htmlelement
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit,OnDestroy {
  
  private p5:any;
  private p52:any;
  private p53:any;
  private p54:any;
  private p55:any;
  private patenciones:any;
  private maxFecha:any=new Date(0);
  private minFecha:any=new Date();
  private maxMonto:any=0;
  private y_up_offset:number=60;
  private y_dw_offset:number=30;
  private y_text_offset:number=10
  private x_rg_offset:number=20;
  private x_lf_offset:number=40;
  private date_shift:number=7
  private monto_shift:number=10
  private char_offset:number=10;
  private intervalo:any=10;
  private pie_chart_radio:number=150;
  private rect_length:number=40;
  private textSize:number=10;
  private radio_point:number=10
  //atenciones
  private maxFechaAtencion=new Date(0)
  private minFechaAtencion=new Date()
  private maxMesAtencion = 1
  private minMesAtencion = 12
  private maxAnioAtencion=0
  private minAnioAtencion=9999
  private maxCantidadAtenciones=0
  private mes_shift=30
  private mes_bar_length=this.mes_shift-10
  private numVets=2
  private numPets=2
  //0 FECHA, 1 MES, 2 AÑO
  private groupBy=1
  // Separar por 0 nada, 1 animal. 2 veterinario
  private splitBy=0
  private origin = { x: 0, y: 0 };
  //const randomY:any=[]
  //const numPts:any=25
  private toggle = true;
  data =[
    [2007,    54],
    [2008,    23],
    [2009,    3],
    [2010,    323],
    [2011,    23],
    [2012,    43],
    [2013,    90],
    [2014,    124],
    [2015,    380]
  ]
  data2=[
    ["10-04-2023",114],
    ["09-04-2023",105],
    ["08-04-2023",102],
    ["07-04-2023",104],
    ["19-12-2022",114]
  ]
  data3:any=[]
  data4:any=[
    ["nahuel",0.1],
    ["marcos",0.15],
    ["fede",0.05],
    ["oscar",0.2],
    ["facu",0.5],
  ]
  atenciones:any[]=[]
  datavista:any=[]
  title = 'my-p5-app';
  constructor() {
    //console.log('digital-constructed');
    window.onresize = this.onWindowResize;
  }
  private onWindowResize = (e:any) => {
    this.p5.resizeCanvas(750, 450);
  }
  
  ngOnInit() {
    this.maxFecha=new Date(0);
    this.minFecha=new Date();
    this.maxMonto=0;
    let data_pts=50
    let pts_atenciones=100
    let fechas:any[]=[]
    for(let i=0;i<data_pts;i++){
      let d = this.randomDate(new Date(2023, 0, 1), new Date(2023, 1, 1));

      let amount = Math.round(Math.random()*181  +25)
      if(!fechas.includes(d.toLocaleDateString())){
        
        if(d<this.minFecha){
          this.minFecha=d
        }
        if(d>this.maxFecha){
          this.maxFecha=d
        }
        if(amount>this.maxMonto){
          this.maxMonto=amount
        }
        this.data3.push([d,amount])
        fechas.push(d.toLocaleDateString())
      }
      
    }
    let primo1=10007
    let primo2=79349
    let seed=25331
    let aleatorio_num=(primo1*seed+primo2)%256
    for(let i=0;i<pts_atenciones;i++){
      let random_fecha=this.randomDate(new Date(2023, 0, 2), new Date(2023,3, 1));
      let dia=random_fecha.getDate()
      let mes=random_fecha.getMonth()
      let year=random_fecha.getFullYear()
      let random_mes=random_fecha.getMonth()+1
      let random_anio=random_fecha.getFullYear()
      if(random_fecha<this.minFechaAtencion){
        this.minFechaAtencion=random_fecha
      }
      if(random_fecha>this.maxFechaAtencion){
        this.maxFechaAtencion=random_fecha
      }
      if(random_mes<this.minMesAtencion){
        this.minMesAtencion = random_mes
      }
      if(random_mes>this.maxMesAtencion){
        this.maxMesAtencion = random_mes
      }
      if(random_anio < this.minAnioAtencion){
        this.minAnioAtencion = random_anio
      }

      // 0 atendido, 1 cancelado 2 vencido
      let random_estado=aleatorio_num % 3
      // 0 juan 1 pedrio 2 oscar
      let random_vet = (aleatorio_num+8) % 3
      // 0 gato 1 perro
      let random_animal=(aleatorio_num*aleatorio_num+aleatorio_num)%2
      let atencion ={
        estado: random_estado,
        veterinario: random_vet==0?"Juan":random_vet==1?"Pedro":"Oscar",
        fecha:new Date(year,mes,dia),
        animal:random_animal==0?"Gato":"Perro"
      }
      this.atenciones.push(atencion)
      aleatorio_num=(primo1*aleatorio_num+primo2)%256
    }
    //console.log(this.atenciones)
    this.maxMonto *= 1.2
    let intervalo= this.maxFecha.getTime()-this.minFecha.getTime()
    this.maxFecha = new Date(this.maxFecha.getTime() + 0.1 * intervalo)
    this.minFecha = new Date(this.minFecha.getTime() - 0.01 * intervalo)
    this.intervalo=intervalo
    this.data3 =this.data3.filter((x:any, i:any, a:any) => a.indexOf(x) === i)
    this.data3.sort((a:any,b:any)=>a[0]<b[0]?-1:1)
    
    // atenciones
    let intervalo_atenciones=this.maxFechaAtencion.getTime() - this.minFechaAtencion.getTime()
    this.minFechaAtencion= new Date(this.minFechaAtencion.getTime() - 0.03 * intervalo_atenciones)
    this.maxFechaAtencion= new Date(this.maxFechaAtencion.getTime() + 0.03 * intervalo_atenciones)

    //console.log("Max monto: "+this.maxMonto)
    this.createCanvas();
    
  }

  ngOnDestroy(): void {
    this.createCanvas();
    
  }
  private addDays(date:any, days:any) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  private randomDate(start:any, end:any) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  private createCanvas = () => {
    
    this.p5 = new p5(this.drawing)
    this.p52 = new p5(this.drawing2)
    this.p53 = new p5(this.drawing3)
    this.p54=new p5(this.drawing4)
    this.p55=new p5(this.drawing5)
    this.patenciones=new p5(this.drawingatenciones)
  }
  private mesShort(mes:string){
    
    let meses=[
      ["Enero","Ene"],
      ["Febrero","Feb"],
      ["Marzo","Mar"],
      ["Abril","Abr"],
      ["Mayo","May"],
      ["Junio","Jun"],
      ["Julio","Jul"],
      ["Agosto","Ago"],
      ["Septiembre","Sep"],
      ["Octubre","Oct"],
      ["Noviembre","Nov"],
      ["Diciembre","Dic"],
    ]
    let smes=meses.filter(m=>m[0]==mes)[0][1]
    
    return smes
  }
  private rgbToHex(r:any,g:any,b:any){
    
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }
  //CONTADOR ATENCIONES
  // ANDA CASI BIEN, las fechas de las barras no andan bien
  private drawingatenciones=(p:any)=>{
    let w:any=750
    let h:any=450
    
    let v_w:any=w-(this.x_lf_offset+this.x_rg_offset+2*this.char_offset)
    let v_h:any=h-(this.y_up_offset+this.y_dw_offset)
    let rojo =220
    let green =65
    let blue =250
    let primo1=10007
    let primo2=79349
    let primo3=65537
    let primo4=43237
    let primo5=12211
    let primo6=90709
    let nuevoColor=(r:number,g:number,b:number)=>{
      let roj=(r*primo1 +primo2)%265;
      let gre=(g*primo3+primo4)%256;
      let blu=(b*primo5+primo6)%256;
      return {rojo:roj,green:gre,blue:blu}
    }
    let meses_cantidad:any={}
    let anios_cantidad:any={}
    let fecha_cantidad:any={}
    //Es una doble hashtable, primero separo por mes y luego por veterinario
    let meses_cantidad_veterinario:any={}
    let fecha_cantidad_veterinario:any={}


    let fecha_contador:any[]=[]
    //Es una doble lista, primero separo por mes y luego por veterinario
    let meses_contador_veterinario:any[]=[]
    let fecha_contador_veterinario:any[]=[]
    let meses_contador:any[]=[]
    let anio_contador:any[]=[]
    // Colores
    let colores_veterinario:any={}
    let colores_animales:any={}
    //colores_veterinario['Oscar']=this.rgbToHex(rojo,green,blue)
    colores_veterinario['Oscar']=this.rgbToHex(rojo,green,blue)
    let nuevos_colores=nuevoColor(rojo,green,blue)
    rojo=nuevos_colores.rojo
    green=nuevos_colores.green
    blue=nuevos_colores.blue
    colores_veterinario['Pedro']=this.rgbToHex(rojo,green,blue)
    nuevos_colores=nuevoColor(rojo,green,blue)
    rojo=nuevos_colores.rojo
    green=nuevos_colores.green
    blue=nuevos_colores.blue
    colores_veterinario['Juan']=this.rgbToHex(rojo,green,blue)
    nuevos_colores=nuevoColor(rojo,green,blue)
    rojo=nuevos_colores.rojo
    green=nuevos_colores.green
    blue=nuevos_colores.blue
    colores_animales['Gato']=this.rgbToHex(rojo,green,blue)
    nuevos_colores=nuevoColor(rojo,green,blue)
    rojo=nuevos_colores.rojo
    green=nuevos_colores.green
    blue=nuevos_colores.blue
    colores_animales['Perro']=this.rgbToHex(rojo,green,blue)
    nuevos_colores=nuevoColor(rojo,green,blue)
    rojo=nuevos_colores.rojo
    green=nuevos_colores.green
    blue=nuevos_colores.blue
    
    

    let meses:any={
      1:"Enero",
      2:"Febrero",
      3:"Marzo",
      4:"Abril",
      5:"Mayo",
      6:"Junio",
      7:"Julio",
      8:"Agosto",
      9:"Septiembre",
      10:"Octubre",
      11:"Noviembre",
      12:"Diciembre",
      "Enero":1,
      "Febrero":2,
      "Marzo":3,
      "Abril":4,
      "Mayo":5,
      "Junio":6,
      "Julio":7,
      "Agosto":8,
      "Septiembre":9,
      "Octubre":10,
      "Noviembre":11,
      "Diciembre":12
    }
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    //console.log("MIn: "+this.minMesAtencion)
    for(let i=0;i<this.atenciones.length;i++){
      let mes=meses[this.atenciones[i].fecha.getMonth()+1]
      let anio=this.atenciones[i].fecha.getFullYear()+1
      let fecha_str=this.atenciones[i].fecha.toLocaleDateString('eng')
      let fecha=this.atenciones[i].fecha
      let veterinario= this.atenciones[i].veterinario
      if(meses_cantidad_veterinario[mes]){
        if(meses_cantidad_veterinario[mes][veterinario]){
          meses_cantidad_veterinario[mes][veterinario] += 1
        }
        else{
          meses_cantidad_veterinario[mes][veterinario]=1
        }
      }
      else{
        meses_cantidad_veterinario[mes] = {}
        meses_cantidad_veterinario[mes][veterinario]=1
      }
      if(fecha_cantidad_veterinario[fecha]){
        if(fecha_cantidad_veterinario[fecha][veterinario]){
          fecha_cantidad_veterinario[fecha][veterinario] += 1
        }
        else{
          fecha_cantidad_veterinario[fecha][veterinario] = 1
        }
      }
      else{
        fecha_cantidad_veterinario[fecha]={}
        fecha_cantidad_veterinario[fecha][veterinario] = 1
      }
      if (meses_cantidad[mes]){
        meses_cantidad[mes] += 1
      }
      else{
        meses_cantidad[mes] = 1
      }
      if(anios_cantidad[anio]){
        anios_cantidad[anio] +=1
      }
      else{
        anios_cantidad[anio] = 1
      }
      if(fecha_cantidad[fecha_str]){
        
        fecha_cantidad[fecha_str] += 1
      }
      else{
        
        fecha_cantidad[fecha_str] = 1
      }
      
    }
    
    this.maxMesAtencion += 1
    
    //console.log("MIn: "+this.minMesAtencion)
    //console.log("Max: "+this.maxMesAtencion)
    let max_cantidad=0
    let max_cantidad_mes=0
    let max_cantidad_anio=0
    
    let intervalo = this.maxFechaAtencion.getTime()-this.minFechaAtencion.getTime()
    let fechas_diferentes=Math.round(intervalo/(1000*60*60*24))
    // Fechas
    Object.entries(fecha_cantidad).forEach((key:any)=>{     
      if(max_cantidad < fecha_cantidad[key[0]]){
        
        max_cantidad = fecha_cantidad[key[0]]
      }
      fecha_contador.push({fecha:key[0],cantidad:fecha_cantidad[key[0]]})
    })
    //Meses
    Object.entries(meses_cantidad).forEach((key:any)=>{
      if(max_cantidad_mes < meses_cantidad[key[0]]){
        max_cantidad_mes = meses_cantidad[key[0]]
      }
      meses_contador.push({mes:key[0],cantidad:meses_cantidad[key[0]],num_mes:meses[key[0]]})
    })
    
    // Meses veterinario
    
    let mes_vet_i=0
    Object.entries(meses_cantidad_veterinario).forEach((mes:any)=>{
      
      meses_contador_veterinario.push([])
      Object.entries(meses_cantidad_veterinario[mes[0]]).forEach((vet:any)=>{
        meses_contador_veterinario[mes_vet_i].push({mes:mes[0],veterinario:vet[0],cantidad:meses_cantidad_veterinario[mes[0]][vet[0]],num_mes:meses[mes[0]]})
      })
      mes_vet_i += 1

    })
    //fecha veterinario
    let fec_vet_i=0
    Object.entries(fecha_cantidad_veterinario).forEach((fec:any)=>{
      fecha_contador_veterinario.push([])
      Object.entries(fecha_cantidad_veterinario[fec[0]]).forEach((vet:any)=>{
        fecha_contador_veterinario[fec_vet_i].push({fecha:fec[0],veterinario:vet[0],cantidad:fecha_cantidad_veterinario[fec[0]][vet[0]]})
      })
      fec_vet_i += 1
    })

    max_cantidad += 1
    max_cantidad_mes += 1
    fecha_contador.sort((a:any,b:any)=>new Date(a.fecha)<new Date(b.fecha)?-1:1)
    meses_contador.sort((a:any,b:any)=>meses[a.mes]<meses[b.mes]?-1:1)
    
    meses_contador_veterinario.sort((a:any,b:any)=>meses[a[0].mes]<meses[b[0].mes]?-1:1)
    fecha_contador_veterinario.sort((a:any,b:any)=>new Date(a[0].fecha)<new Date(b[0].fecha)?-1:1)
    //console.log(meses_contador_veterinario.length)
    for(let i=0;i<meses_contador_veterinario.length;i++){
      //console.log(meses_contador_veterinario[i])
      meses_contador_veterinario[i].sort((a:any,b:any)=>a.veterinario<b.veterinario?-1:1)
    }
    //console.log(meses_contador_veterinario)
    //fEchas
    for(let i=0;i<fecha_contador.length;i++){
      //console.log(new Date(fecha_contador[i].fecha))
      let x=(new Date(fecha_contador[i].fecha).getTime()-this.minFechaAtencion.getTime())/(this.maxFechaAtencion.getTime()-this.minFechaAtencion.getTime())
      //console.log(x)
      let y=fecha_contador[i].cantidad/max_cantidad
      //puntos.push({x:x*v_w+this.x_lf_offset+this.char_offset,y: h-(v_h*y+this.y_dw_offset),valor:this.maxMonto*y,monto:this.data3[i][1],fecha:new Date(this.data3[i][0]).toLocaleDateString('arg',{day: 'numeric', month: 'numeric', year: '2-digit'})})
      fecha_contador[i].x=x*v_w+this.x_lf_offset+this.char_offset
      
      fecha_contador[i].y=h-(v_h*y+this.y_dw_offset)
      
    }
    //Meses
    for(let i=0;i<meses_contador.length;i++){
      let inter_v_w = v_w - this.mes_shift
      //console.log(meses_contador[i].num_mes)
      let x = (meses_contador[i].num_mes-this.minMesAtencion)/(this.maxMesAtencion-this.minMesAtencion)
      //console.log(x)
      let y = meses_contador[i].cantidad/max_cantidad_mes
      meses_contador[i].x= x * inter_v_w+this.x_lf_offset+this.mes_shift
      meses_contador[i].y= h - (v_h * y +this.y_dw_offset)
    }
    // Meses veterinario
    for(let i=0;i<meses_contador_veterinario.length;i++){
      //Esta primera tanda me puede dar el x y el y mayor
      let inter_v_w = v_w - this.mes_shift
      //console.log(meses_contador[i].num_mes)
      let x = (meses_contador[i].num_mes-this.minMesAtencion)/(this.maxMesAtencion-this.minMesAtencion)
      //console.log(x)
      //let y = meses_contador[i].cantidad/max_cantidad_mes    
      for(let j=0;j<meses_contador_veterinario[i].length;j++){
        let y_offset=0
        for(let k=0;k<j;k++){
          let y_alto_offset = meses_contador_veterinario[i][k].cantidad/max_cantidad_mes
          y_offset += v_h *(y_alto_offset) 
        }
        let y_alto = meses_contador_veterinario[i][j].cantidad/max_cantidad_mes
        meses_contador_veterinario[i][j].x=x * inter_v_w+this.x_lf_offset+this.mes_shift
        meses_contador_veterinario[i][j].y_inicial= v_h *(1- y_alto) +this.y_up_offset-y_offset//v_h-y_offset*v_h
        
        //console.log("MEs:"+meses_contador_veterinario[i][j].mes+" vet: "+meses_contador_veterinario[i][j].veterinario)
        //console.log(h-(v_h*y_offset+this.y_dw_offset))
        meses_contador_veterinario[i][j].y_alto=y_alto*v_h
        meses_contador_veterinario[i][j].color=colores_veterinario[meses_contador_veterinario[i][j].veterinario]
        
      }
    }
    for(let i=0;i<fecha_contador_veterinario.length;i++){
      let x=(new Date(fecha_contador_veterinario[i][0].fecha).getTime()-this.minFechaAtencion.getTime())/(this.maxFechaAtencion.getTime()-this.minFechaAtencion.getTime())
      for(let j=0;j<fecha_contador_veterinario[i].length;j++){
        let y_offset=0
        for(let k=0;k<j;k++){
          let y_alto_offset = fecha_contador_veterinario[i][k].cantidad/max_cantidad
          y_offset += v_h *(y_alto_offset)
        }
        let y_alto=fecha_contador_veterinario[i][j].cantidad/max_cantidad
        fecha_contador_veterinario[i][j].x=x * v_w+this.x_lf_offset+this.char_offset
        fecha_contador_veterinario[i][j].y_inicial= v_h *(1- y_alto) +this.y_up_offset-y_offset//v_h-y_offset*v_h
        
        //console.log("MEs:"+meses_contador_veterinario[i][j].mes+" vet: "+meses_contador_veterinario[i][j].veterinario)
        //console.log(h-(v_h*y_offset+this.y_dw_offset))
        fecha_contador_veterinario[i][j].y_alto=y_alto*v_h
        fecha_contador_veterinario[i][j].color=colores_veterinario[fecha_contador_veterinario[i][j].veterinario]
        
      }
      //console.log(x)
      
    }
    console.log(fecha_contador_veterinario)

    p.setup=()=>{
      p.createCanvas(w+100,h).parent('oficial-atention-count')
    }
    let bar_length=v_w/fechas_diferentes
    p.draw=()=>{
      // Por fecha
      if(this.groupBy==0){
        p.background(255)
        p.stroke(0.5)
        p.textSize(12)
        this.drawFechaLabels(p,h,this.maxFechaAtencion,this.minFechaAtencion,v_w,v_h,max_cantidad)
        // Sin separar
        if(this.splitBy==0){
          this.drawBarsFecha(p,v_w,v_h,fecha_contador,fechas_diferentes)

          for(let i=0;i<fecha_contador.length;i++){
            let y0 =fecha_contador[i].y
            let yf = this.y_up_offset+v_h
            let x0 = fecha_contador[i].x- 0.5* bar_length
            let x1 = fecha_contador[i].x + 0.5*bar_length
            if(p.mouseX<=x1 && p.mouseX>x0 && p.mouseY <=yf && p.mouseY> y0){
              p.fill(255)
              //p.noStroke()
              p.rect(p.mouseX,p.mouseY,80,30)
              p.textSize(8)
              p.fill(0)
              p.text("Fecha: "+new Date(fecha_contador[i].fecha).toLocaleDateString('arg',{day: 'numeric', month: 'numeric', year: '2-digit'}),p.mouseX+5,p.mouseY+12)
              p.text("Cantidad: "+fecha_contador[i].cantidad,p.mouseX+5,p.mouseY+22)
            }
          }
        }
        //Separar por veterinario
        else if(this.splitBy==2){
          this.drawBarsFechaVeterinario(p,v_w,v_h,fecha_contador_veterinario,fechas_diferentes)

          for(let i=0;i<fecha_contador.length;i++){
            let y0 =fecha_contador[i].y
            let yf = this.y_up_offset+v_h
            let x0 = fecha_contador[i].x- 0.5* bar_length
            let x1 = fecha_contador[i].x + 0.5*bar_length
            //console.log(p.mouseX,p.mouseY)
            //console.log(x0,x1)
            //console.log(y0,yf)
            if(p.mouseX<=x1 && p.mouseX>x0 && p.mouseY <=yf && p.mouseY> y0){
              p.fill(255)
              //p.noStroke()
              p.rect(p.mouseX,p.mouseY,130,30+6*fecha_contador_veterinario[i].length)
              p.textSize(8)
              p.fill(0)
              p.text("Fecha: "+new Date(fecha_contador[i].fecha).toLocaleDateString('arg',{day: 'numeric', month: 'numeric', year: '2-digit'}),p.mouseX+5,p.mouseY+12)
              p.text("Cantidad total: "+fecha_contador[i].cantidad,p.mouseX+5,p.mouseY+22)
              //console.log(fecha_contador_veterinario[i])
              for(let j=0;j<fecha_contador_veterinario[i].length;j++){
                p.text("Cantidad "+fecha_contador_veterinario[i][j].veterinario+": "+fecha_contador_veterinario[i][j].cantidad,p.mouseX+5,p.mouseY+22+(j+1)*6)
              }
              
            }
          }
        }
        
      }
      // Por mes
      else if(this.groupBy ==1){
        p.background(255)
        p.stroke(0.5)
        p.textSize(12)
        this.drawMesLabel(p,h,this.maxMesAtencion,this.minMesAtencion,v_w,v_h,max_cantidad_mes,meses)
        //Sin seprar
        if(this.splitBy==0){
          this.drawBarsMes(p,v_h,meses_contador,this.mes_bar_length )
          for(let i=0;i<meses_contador.length;i++){
            let y0 =meses_contador[i].y
            let yf = this.y_up_offset+v_h
            let x0 = meses_contador[i].x- 0.5* this.mes_bar_length
            let x1 = meses_contador[i].x + 0.5*this.mes_bar_length
            if(p.mouseX<=x1 && p.mouseX>x0 && p.mouseY <=yf && p.mouseY> y0){
              p.fill(255)
              //p.noStroke()
              p.rect(p.mouseX,p.mouseY,80,30)
              p.textSize(8)
              p.fill(0)
              p.text("Mes: "+meses_contador[i].mes,p.mouseX+5,p.mouseY+12)
              p.text("Cantidad: "+meses_contador[i].cantidad,p.mouseX+5,p.mouseY+22)
            }
          }
        }
        //Separar por veterinario
        else if(this.splitBy==2){
          this.drawBarsMesVeterinario(p,v_h,meses_contador_veterinario,this.mes_bar_length)
          for(let i=0;i<meses_contador.length;i++){
            let y0 =meses_contador[i].y
            let yf = this.y_up_offset+v_h
            let x0 = meses_contador[i].x- 0.5* this.mes_bar_length
            let x1 = meses_contador[i].x + 0.5*this.mes_bar_length
            if(p.mouseX<=x1 && p.mouseX>x0 && p.mouseY <=yf && p.mouseY> y0){
              p.fill(255)
              //p.noStroke()
              p.rect(p.mouseX,p.mouseY,80,30+ 10 * meses_contador_veterinario[i].length)
              p.textSize(8)
              p.fill(0)
              p.text("Mes: "+meses_contador[i].mes,p.mouseX+5,p.mouseY+12)
              p.text("Cantidad: "+meses_contador[i].cantidad,p.mouseX+5,p.mouseY+22)
              for(let j=0;j<meses_contador_veterinario[i].length;j++){
                p.text("Cantidad "+meses_contador_veterinario[i][j].veterinario+": "+meses_contador_veterinario[i][j].cantidad,p.mouseX+5,p.mouseY+22+9*(j+1))
              }
            }
          }
        }
        
      }
      // Por año
      else{
        p.background(255)
      }
      p.strokeWeight(3)
      this.drawAxis(p,h,w)
      
      
    }
  }
  private drawFechaLabels(p:any,h:any,maxFecha:any,minFecha:any,v_w:any,v_h:any,max_cantidad:any){
    p.fill(0)
    // Obvio que voy a dibujar la min fecha, la max fecha
    // Pero como haago para encajar las an atenciones, podria ser barras re finitas cuyo centro es la fecha
    let intervalo = maxFecha.getTime()-minFecha.getTime()
    let intervalo_monto = max_cantidad
    //let fechas:any = []
    //p.strokeWeight(0.2)
    for(let i=0;i<11;i++){
      p.strokeWeight(0.2)  
      p.text(new Date(intervalo * i/10+ this.minFecha.getTime()).toLocaleDateString('arg',{day: 'numeric', month: 'numeric', year: '2-digit'}),(i/10)*(v_w-this.date_shift)-this.date_shift+this.x_lf_offset,h-this.y_text_offset)
      let x_raya=(i/10)*(v_w)+this.x_lf_offset//+this.char_offset
      p.line(x_raya,h-this.y_text_offset-20,x_raya,h-this.y_text_offset-30)
      
      // Dibujar la linea vertical
      //p.strokeWeight(0.8)
      p.line(x_raya,this.y_up_offset,x_raya,h-this.y_dw_offset)
      p.strokeWeight(0.8)
      p.line(x_raya,h-this.y_dw_offset,x_raya,h-this.y_dw_offset+5)
      //p.strokeWeight(0.9)
      
    }
    p.strokeWeight(0.2)
    let ylabels=max_cantidad<20?max_cantidad:20
    for(let i=0;i<=ylabels;i++){
      let y_monto = h-this.y_dw_offset-v_h*(i/ylabels)
      //let y_monto=h-this.y_up_offset-v_h*intervalo_monto*(i+1)/v_h
      p.text(Math.round(intervalo_monto*i/ylabels),this.monto_shift,y_monto+3)
      p.line(this.x_lf_offset,y_monto,this.x_lf_offset+5,y_monto)
      //p.strokeWeight(0.2)
      // las horizontales
      p.line(this.x_lf_offset,y_monto,this.x_lf_offset+v_w,y_monto)
      //p.strokeWeight(1)
    }


  }
  private drawBarsFecha(p:any,v_w:any,v_h:any,fecha_contador:any[],fechas_diferentes:any){
    let bar_length=v_w/fechas_diferentes
    //p.strokeWeight(0.5)
    p.strokeWeight(0)
    //console.log(fecha_contador)
    for(let i=0;i<fecha_contador.length;i++){
      p.fill(150,80,150)
      //p.fill('#222222')
      let altura=this.y_up_offset+v_h - fecha_contador[i].y
      p.rect(fecha_contador[i].x - 0.9 * bar_length/2,fecha_contador[i].y,0.9 * bar_length,altura)
    }
  }
  private drawBarsFechaVeterinario(p:any,v_w:any,v_h:any,fecha_contador_veterinario:any[],fechas_diferentes:any){
    let bar_length=v_w/fechas_diferentes
    //p.strokeWeight(0.5)
    p.strokeWeight(0)
    for(let i=0;i<fecha_contador_veterinario.length;i++){
      for(let j=0;j<fecha_contador_veterinario[i].length;j++){
        p.fill(fecha_contador_veterinario[i][j].color)
        let altura= fecha_contador_veterinario[i][j].y_alto
        p.rect(fecha_contador_veterinario[i][j].x -0.9 * bar_length/2,fecha_contador_veterinario[i][j].y_inicial,0.9 * bar_length,altura)
      }
    }
  }  
  private drawMesLabel(p:any,h:any,maxMes:any,minMes:any,v_w:any,v_h:any,max_cantidad:any,meses:any){
    p.fill(0)
    // Obvio que voy a dibujar la min fecha, la max fecha
    // Pero como haago para encajar las an atenciones, podria ser barras re finitas cuyo centro es la fecha
    let intervalo = maxMes-minMes
    let intervalo_monto = max_cantidad
    let inter_v_w=v_w - this.mes_shift
    for(let i=0;i<intervalo;i++){
      p.strokeWeight(0.2)
      p.text(this.mesShort(meses[minMes+i]),((i)/intervalo)*(inter_v_w)-this.date_shift+this.x_lf_offset+this.mes_shift,h-this.y_text_offset)
      let x_raya=((i)/intervalo)*(inter_v_w)+this.x_lf_offset+this.mes_shift//+this.char_offset
      p.line(x_raya,h-this.y_text_offset-20,x_raya,h-this.y_text_offset-30)
      
      // Dibujar la linea vertical
      p.line(x_raya,this.y_up_offset,x_raya,h-this.y_dw_offset)
      p.strokeWeight(0.8)
      p.line(x_raya,h-this.y_dw_offset,x_raya,h-this.y_dw_offset+5)
    }
    p.strokeWeight(0.2)
    let ylabels=max_cantidad<20?max_cantidad:20
    for(let i=0;i<=ylabels;i++){
      
      let y_monto = h-this.y_dw_offset-v_h*(i/ylabels)
      p.text(Math.round(intervalo_monto*i/ylabels),this.monto_shift,y_monto+3)
      p.line(this.x_lf_offset,y_monto,this.x_lf_offset+5,y_monto)
      // las horizontales
      p.line(this.x_lf_offset,y_monto,this.x_lf_offset+v_w,y_monto)

    }
  }
  private drawBarsMes(p:any,v_h:any,meses_contador:any,bar_length:any){
    p.strokeWeight(0)
    //console.log(fecha_contador)
    for(let i=0;i<meses_contador.length;i++){
      p.fill(150,80,150)
      
      let altura=this.y_up_offset+v_h - meses_contador[i].y
      p.rect(meses_contador[i].x -0.9 * bar_length/2,meses_contador[i].y,0.9 * bar_length,altura)
    }
  }
  private drawBarsMesVeterinario(p:any,v_h:any,meses_contador_veterinario:any,bar_length:any){
    p.strokeWeight(0)
    //console.log(fecha_contador)
    
    for(let i=0;i<meses_contador_veterinario.length;i++){
      for(let j=0;j<meses_contador_veterinario[i].length;j++){
        //console.log(meses_contador_veterinario[i][j].color)
        p.fill(meses_contador_veterinario[i][j].color)
        let altura= meses_contador_veterinario[i][j].y_alto
        p.rect(meses_contador_veterinario[i][j].x -0.9 * bar_length/2,meses_contador_veterinario[i][j].y_inicial,0.9 * bar_length,altura)
      }
      
      
    }
  }
  private drawAnioLabel(p:any,maxAnio:any,minAnio:any,v_w:any,v_h:any,anio_contador:any){

  }
  // OFICIAL PIE CHART
  private drawing5 = (p:any)=>{
    let angles=this.data4.map((d:any) => d[1]*360)
    let centers = []
    let colores:any[] = []
    let limites:any[]=[]
    //22,22,22
    //87,65,250
    let rojo =87
    let azul =65
    let yellow =250
    let primo1=10007
    let primo2=79349
    let primo3=65537
    let primo4=43237
    let primo5=12211
    let primo6=90709
    let m=256
    let acumulado=0
    for(let i =0;i<angles.length;i++){
      if(i===0){
        centers.push(angles[0]/2)
        acumulado += angles[0]
        limites.push({init:0,fin:angles[0]})
      }
      else if(i===angles.length-1){
        centers.push((360-acumulado)/2+acumulado)
        limites.push({init:acumulado,fin:360})
      }
      else{
        centers.push((angles[i]-angles[i-1])/2+acumulado)
        limites.push({init:acumulado,fin:acumulado+angles[i]})
        acumulado+=angles[i]
      }
      colores.push({r:rojo,y:yellow,a:azul})
      rojo = (primo1*rojo + primo2)%m
      azul = (primo3*azul + primo4)%m
      yellow = (primo5*yellow + primo6)%m
    }
    //console.log(angles)
    //let angles = [30, 10, 45, 35, 60, 38, 75, 67];
    //const suma = angles.reduce((ac:any,cal:any)=>ac+cal,0)
    //console.log(suma)
    
    p.setup =()=>{
      p.createCanvas(750,450).parent('oficial-pie-canva')
      //p.noStroke()
      
    }
    p.draw=()=>{

      let sq=(x:any)=>Math.sqrt(x)
      let pw=(x:any)=>x*x
      let ab=(x:any)=>Math.abs(x)
      p.background(255)
      p.fill(0)
      p.textSize(25)
      p.text("Importancia de proveedores",p.width/2-160,30)
      p.textSize(12)
      p.text("Proveedores",25,185 )
      //p.stroke(0)
      //p.line(25,193,100,193)
      p.stroke(255)
      for(let i=0;i<this.data4.length;i++){
        p.fill(0)
        p.textSize(10)
        p.text(this.data4[i][0],50,20*(i)+207)
        p.fill(colores[i].r,colores[i].a,colores[i].y);
        p.rect(30,20*(i)+200,10,10)
        
      }
      this.pieChart2(p,2*this.pie_chart_radio,angles,angles,colores)
      
      let radio=sq(pw(p.mouseX-p.width/2)+pw(p.mouseY-p.height/2))
      let angle=0
      if(radio>0.0001){
        let x_prim=p.mouseX-p.width/2
        let y_prim=p.mouseY-p.height/2
        if (x_prim<0){
          if(y_prim<0){
            angle=Math.atan(ab(y_prim/x_prim))
            //angle = p.PI/2-angle
            angle += p.PI
          }
          else{
            angle=Math.atan(ab(y_prim/x_prim))
            angle = p.PI/2-angle
            angle += p.PI/2
          }
        }
        else{
          if(y_prim<0){
            angle=Math.atan(ab(y_prim/x_prim))
            angle = p.PI/2-angle
            angle += 3*p.PI/2
          }
          else{
            angle=Math.atan(y_prim/x_prim)
          }
        }
        
        //angle=Math.arc(y_prim/x_prim)
        //p.fill(0)
        //p.text("x: "+x_prim+" , y: "+y_prim ,500,30)
      }
      angle *= 180/p.PI
      //p.fill(0)
      //p.text("Radio: "+radio+" , angle: "+angle ,30,30)
      for(let i=0;i<limites.length;i++){
        

        if(radio<=this.pie_chart_radio && angle<limites[i].fin && angle>=limites[i].init){
          p.fill(255)
          p.rect(p.mouseX,p.mouseY,3*this.rect_length,this.rect_length)
          p.fill(0)
          //p.text("Radio: "+radio+" , angle: "+angle + " , proveedor: "+this.data4[i][0],30,30)
          p.textSize(this.textSize)
          p.text("Proveedor: ",p.mouseX+10,p.mouseY+15)
          p.text(this.data4[i][0],p.mouseX+70,p.mouseY+15)
          p.text("Porcentaje: ",p.mouseX+10,p.mouseY+30)
          p.text(Math.round(this.data4[i][1]*100)+"%",p.mouseX+70,p.mouseY+30)
          p.fill(0)
        }
      }

      
    }
  }
  private drawing2 =(p:any)=>{
    let randomY:any =[]
    let numPts:any = 100
    p.setup=()=>{
      p.createCanvas(750, 450).parent('line-canvas');
      for(let i =0; i< numPts; i++){
        randomY.push(p.random(100,300)); 
      }
    }
    p.draw =()=>{
      p.background(200)
      this.drawEllipses(p,randomY,numPts)
      this.drawLines(p,randomY,numPts)
    }
  }
  private drawEllipses(p:any,randomY:any,numPts:any){
    p.noStroke();
      // draw ellipses
    for(let i =0; i < randomY.length; i++){
      let x = i * (p.width / (numPts-1));
      let y = randomY[i];
      p.ellipse(x, y, 30);
    }
  }
  private drawEllipses2(p:any,Ys:any,numPts:any){
    p.noStroke();
      // draw ellipses
    for(let i =0; i < Ys.length; i++){
      let x = i * (p.width / (numPts-1));
      let y = Ys[i];
      p.fill(0)
      p.ellipse(x, y, 3);
    }
  }
  private drawLines(p:any,randomY:any,numPts:any){
    p.stroke(0);
   // draw lines
    let px = 0;
    let py = randomY[0];
    for(let i =0; i < randomY.length; i++){
      let x = i * (p.width / (numPts-1));
      let y = randomY[i];
      p.line(px, py, x, y);
      
      //store the last position
      px = x;
      py = y;
    }
  }
  private drawLines2(p:any,Ys:any,numPts:any){
    p.stroke(0);
    // draw lines
     let px = 0;
     let py = Ys[0];
     for(let i =0; i < Ys.length; i++){
       let x = i * (p.width / (numPts-1));
       let y = Ys[i];
       p.line(px, py, x, y);
       
       //store the last position
       px = x;
       py = y;
     }
  }
  private drawing =  (p: any) => {
    let randomY:any=[]
    let numPts:any=25
    let d:any =this.data2
    p.setup = () => {
      p.createCanvas(750, 450).parent('digital-watch-canvas');
      //p.background(0);
      //console.log(this)
      p.cols=d[0].length
      p.rows=d.length
      p.max=0
      d.forEach((r: any[])  => {
        
        if(r[1]>p.max){
          p.max=r[1]
        }
      });
    };

    p.draw = () => {
      p.background(220);
      p.fill(0)
      
      for (var i = 0; i < p.rows; i++) {
        p.fill(0)
        //place years
        p.text(d[i][0], i * 80 + 60, 420);
        p.fill("blue")
        //draw graph
        p.rect(i * 80 + 85, 400 - d[i][1], 20,d[i][1])
      }
      p.fill(0)
       //determine highest value
       let maxValue=p.max;
      for (var k=0;k<maxValue;k=k+50){
        p.text(k,10,420-k);
      }
    };
  }
  private drawing3 = (p:any)=>{
    let angles = [30, 10, 45, 35, 60, 38, 75, 67];
    p.setup = () => {
      p.createCanvas(750, 450).parent('pie-canvas');
      p.noStroke()
      p.noLoop()
    }
    p.draw =() =>{
      p.background(100)
      this.pieChart(p,300,angles,angles)
    }
  }
  // OFICIAL LINE CHART
  private drawing4 = (p:any)=>{
    let w:any=750
    let h:any=450
    let Ys:any =[]
    let v_w:any=w-(this.x_lf_offset+this.x_rg_offset+2*this.char_offset)
    let v_h:any=h-(this.y_up_offset+this.y_dw_offset)
    
    
    let numPts:any = this.data3.length
    let puntos:any =[]
    let xeg=(this.minFecha.getTime()-this.minFecha.getTime())/(this.maxFecha.getTime()-this.minFecha.getTime())*v_w+this.x_lf_offset+this.char_offset
    let yeg = h-(v_h*1+this.y_dw_offset)
    //puntos.push({x:xeg,y: yeg,valor:this.maxMonto*this.maxMonto,monto:this.maxMonto})
    for(let i=0;i<numPts;i++){
      Ys.push(this.data3[i][1])
      let x=(new Date(this.data3[i][0]).getTime()-this.minFecha.getTime())/(this.maxFecha.getTime()-this.minFecha.getTime())
      let y=this.data3[i][1]/this.maxMonto
      //puntos.push({x:x*v_w+this.x_lf_offset+this.char_offset,y: h-(v_h*y),valor:y})
      puntos.push({x:x*v_w+this.x_lf_offset+this.char_offset,y: h-(v_h*y+this.y_dw_offset),valor:this.maxMonto*y,monto:this.data3[i][1],fecha:new Date(this.data3[i][0]).toLocaleDateString('arg',{day: 'numeric', month: 'numeric', year: '2-digit'})})
    }
    
    //console.log(puntos)
    p.setup=()=>{
      
      p.createCanvas(w, h).parent('oficial-line-canva');
      
    }
    p.draw =()=>{
      
      p.background(255)
      p.textSize(20)
      p.text("Insumo por fecha",p.width/2-120,30)
      p.strokeWeight(2)
      p.fill(255,0,0)
      //p.line(this.x_lf_offset,225,750-this.x_rg_offset,225)
      p.fill(0)
      p.strokeWeight(3)
      this.drawAxis(p,h,w)
      //this.drawEllipses2(p,Ys,numPts)
      //this.drawLines2(p,Ys,numPts)
      p.textSize(12)
      this.drawLabels(p,h,v_w,v_h)
      p.strokeWeight(0.7)
      this.drawPuntos(p,puntos)
      for(let i=0;i<puntos.length;i++){
        if(p.dist(puntos[i].x,puntos[i].y,p.mouseX,p.mouseY)<this.radio_point){
          
          p.fill(255)
          //p.noStroke()
          p.rect(p.mouseX,p.mouseY,70,30)
          p.textSize(8)
          p.fill(0)
          p.text("Fecha: "+puntos[i].fecha,p.mouseX+5,p.mouseY+12)
          p.text("Cantidad: "+puntos[i].monto,p.mouseX+5,p.mouseY+22)
        }
      }
      /*
      if(p.mouseX>=this.x_lf_offset+this.char_offset && p.mouseX<= w-this.x_rg_offset-this.char_offset && p.mouseY>=this.y_up_offset && p.mouseY<= h-this.y_dw_offset){
        let x = p.mouseX-(this.x_lf_offset+this.char_offset)
        let y = p.mouseY - (this.y_up_offset)
        let fecha = new Date(this.minFecha.getTime()+this.intervalo*x/v_w)
        let y_prop=y/(v_h)
        let monto = Math.round(this.maxMonto*(1-y_prop))
        p.text("Fecha: "+fecha.toLocaleDateString()+" , Cantidad: "+monto ,this.x_lf_offset,50)
        //p.text("Fecha: "+fecha.toLocaleDateString()+" , Cantidad: "+monto + " , y: "+(y)+" y prop: "+ y_prop,this.x_lf_offset,50)
        //console.log(x,y)
      }
      */

    }
    
    
  }
  private drawLabels(p:any,h:number,v_w:number,v_h:number){
    let intervalo = this.maxFecha.getTime()-this.minFecha.getTime()
    let intervalo_monto = this.maxMonto
    //let fechas:any = []
    for(let i=0;i<11;i++){
      p.text(new Date(intervalo * i/10+ this.minFecha.getTime()).toLocaleDateString('arg',{day: 'numeric', month: 'numeric', year: '2-digit'}),(i/10)*(v_w-this.date_shift)-this.date_shift+this.x_lf_offset,h-this.y_text_offset)
      let x_raya=(i/10)*(v_w)+this.x_lf_offset//+this.char_offset
      p.line(x_raya,h-this.y_text_offset-20,x_raya,h-this.y_text_offset-30)
      p.strokeWeight(0.2)
      // Dibujar la linea vertical
      p.line(x_raya,this.y_up_offset,x_raya,h-this.y_dw_offset)
      p.strokeWeight(3)
      
    }
    let ylabels=20
    for(let i=0;i<=ylabels;i++){
      let y_monto = h-this.y_dw_offset-v_h*(i/ylabels)
      //let y_monto=h-this.y_up_offset-v_h*intervalo_monto*(i+1)/v_h
      p.text(Math.round(intervalo_monto*i/ylabels),this.monto_shift,y_monto+3)
      p.line(this.x_lf_offset,y_monto,this.x_lf_offset+5,y_monto)
      p.strokeWeight(0.2)
      // las horizontales
      p.line(this.x_lf_offset,y_monto,this.x_lf_offset+v_w,y_monto)
      p.strokeWeight(3)
    }


  }
  private drawPuntos(p:any,puntos:any){
    for(let i=0;i<puntos.length-1;i++){
      p.fill(0)
      p.ellipse(puntos[i].x, puntos[i].y, 5);
      p.ellipse(puntos[i+1].x, puntos[i+1].y, 5);
      
      p.line(puntos[i].x,puntos[i].y,puntos[i+1].x,puntos[i+1].y)
    }
  }
  private drawAxis(p:any,h:number,w:number){
    // y axis
    p.line(this.x_lf_offset,this.y_up_offset,this.x_lf_offset,h-this.y_dw_offset)
    // x axis
    p.line(this.x_lf_offset,h-this.y_dw_offset,w-this.x_rg_offset,h-this.y_dw_offset)
  }
  private pieChart(p:any,diameter:any, data:any,angles:any) {
    let lastAngle = 0;
    for (let i = 0; i < data.length; i++) {
      let gray = p.map(i, 0, data.length, 0, 255);
      p.fill(gray);
      p.arc(
        p.width / 2,
        p.height / 2,
        diameter,
        diameter,
        lastAngle,
        lastAngle + p.radians(angles[i])
      );
      lastAngle += p.radians(angles[i]);
    }
  }
  private pieChart2(p:any,diameter:any,data:any,angles:any,colores:any[]){
    let lastAngle = 0;
    for (let i = 0; i < data.length; i++) {
      //let gray = p.map(i, 0, data.length, 0, 255);
      //p.strokeWeight(4)

      p.fill(colores[i].r,colores[i].a,colores[i].y);
      p.arc(
        p.width / 2,
        p.height / 2,
        diameter,
        diameter,
        lastAngle,
        lastAngle + p.radians(angles[i])
      );
      lastAngle += p.radians(angles[i]);
      
    }
    let sumada=0
    p.strokeWeight(0.9)
    for(let i=0;i<data.length;i++){
      p.stroke(255)
      let x=p.cos(p.radians(sumada))*diameter/2+p.width/2
      let y=p.sin(p.radians(sumada))*diameter/2+p.height/2
      //console.log(x,y)
      p.line(p.width/2,p.height/2,x,y)
      sumada += angles[i]
    }
  }
  imprimirLinea(){
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();
    let unDiv = document.getElementById('oficial-line-canva')! as HTMLDivElement
    let canvas=unDiv.children[0] as HTMLCanvasElement
    //console.log(unDiv.children[0])
    
    doc.text("Grafico Linea", 10, 10);
    autoTable(doc,{
      head:[['Fecha','Monto']],
      body:this.data2
    })
    let ancho = 210
    doc.addImage(canvas,'jpeg',0,this.data2.length*15,ancho,ancho*420/750)
    //doc.html(document.getElementById('oficial-line-canva')!)
    //console.log(document.getElementById('oficial-line-canva'))
    
    doc.save("Insumos por tiempo.pdf");
  }
  imprimirPie(){
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();
    let unDiv = document.getElementById('oficial-pie-canva')! as HTMLDivElement
    let canvas=unDiv.children[0] as HTMLCanvasElement
    //console.log(unDiv.children[0])
    
    doc.text("Grafico pie", 10, 10);
    autoTable(doc,{
      head:[['Proveedor','Importancia']],
      body:this.data4
    })
    let ancho = 210
    doc.addImage(canvas,'jpeg',0,this.data4.length*15,ancho,ancho*420/750)
    //doc.html(document.getElementById('oficial-line-canva')!)
    //console.log(document.getElementById('oficial-line-canva'))
    
    doc.save("Importancia de proveedores.pdf");
  }
  
  private table2csv(table:any,headers:any[]){
    let csv ="" 
    for(let i=0;i<headers.length;i++){
      csv+=headers[i]
      if(i!==headers.length-1){
          csv+=","
      }
    }
    csv+="\n"
    for(let i=0;i<table.length;i++){
      for(let j=0;j<headers.length;j++){
          csv+=new Date(table[i][0]).toLocaleDateString('arg')
          
          csv+=","
          csv += table[i][1]
          csv+="\n"
      }
    
      
    }
  
    return [csv]
  }
  imprimirLineaCSV(){
    //let new_table= this.table2table(this.data4)
    let items=this.table2csv(this.data3,["Fecha","Cantidad"])
    var blob = new Blob(items,
      { type: "text/plain;charset=utf-8" });
    // @ts-ignore
    saveAs(blob,"Insumo por fecha.csv");
  }
  agruparPorFecha(){
    this.groupBy=0
  }
  agruparPorMes(){
    this.groupBy=1
  }
  agruparPorAno(){
    this.groupBy=2
  }
  sinSeparar(){
    this.splitBy=0
  }
  separarPorVeterinario(){
    this.splitBy=2
  }
  separarPorAnimal(){
    this.splitBy=1
  }
  
}
