import { Component, OnInit, OnDestroy } from '@angular/core';
import * as  p5 from 'p5';

// ME SIRVEN
//https://editor.p5js.org/jsarachan/sketches/ry8TEc_0b
//https://editor.p5js.org/shiuheng/sketches/ghtlplGgf
//https://observablehq.com/@floran-hachez/vega-lite-pie-chart
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
    let fechas:any[]=[]
    for(let i=0;i<data_pts;i++){
      let d = this.randomDate(new Date(2023, 0, 1), new Date());
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
    
    this.maxMonto *= 1.2
    let intervalo= this.maxFecha.getTime()-this.minFecha.getTime()
    this.maxFecha = new Date(this.maxFecha.getTime() + 0.1 * intervalo)
    this.minFecha = new Date(this.minFecha.getTime() - 0.01 * intervalo)
    this.intervalo=intervalo
    this.data3 =this.data3.filter((x:any, i:any, a:any) => a.indexOf(x) === i)
    this.data3.sort((a:any,b:any)=>a[0]<b[0]?-1:1)
    
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
  
  
}
