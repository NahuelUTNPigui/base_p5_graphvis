import { Component, OnInit, OnDestroy } from '@angular/core';
import * as  p5 from 'p5';
// ME SIRVEN
//https://editor.p5js.org/jsarachan/sketches/ry8TEc_0b
//https://editor.p5js.org/shiuheng/sketches/ghtlplGgf
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit,OnDestroy {
  
  private p5:any;
  private p52:any;
  private p53:any;
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
  title = 'my-p5-app';
  constructor() {
    console.log('digital-constructed');
    window.onresize = this.onWindowResize;
  }
  private onWindowResize = (e:any) => {
    this.p5.resizeCanvas(750, 450);
  }
  ngOnInit() {
    
    this.createCanvas();
    
  }

  ngOnDestroy(): void {
    this.createCanvas();
    
  }
  private createCanvas = () => {
    
    this.p5 = new p5(this.drawing)
    this.p52 = new p5(this.drawing2)
    this.p53 = new p5(this.drawing3)
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
      p.ellipse(x, y, 7);
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
  
  
}
