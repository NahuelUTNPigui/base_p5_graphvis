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
  title = 'my-p5-app';
  constructor() {
    console.log('digital-constructed');
    window.onresize = this.onWindowResize;
  }
  private onWindowResize = (e:any) => {
    this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);
  }
  ngOnInit() {
    console.log('digital-init');
    this.createCanvas();
    
  }

  ngOnDestroy(): void {
    this.createCanvas();
    console.log('audio-destroy');
  }
  private createCanvas = () => {
    console.log('creating canvas');
    this.p5 = new p5(this.drawing)
    
  }
  
  private drawing =  (p: any) => {
    let randomY:any=[]
    let numPts:any=25
    let d =this.data
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight).parent('digital-watch-canvas');
      //p.background(0);
      //console.log(this)
      p.cols=d[0].length
      p.rows=d.length
      p.max=0
      d.forEach((r: any[])  => {
        if(r[0]>p.max){
          p.max=r[0]
        }
      });
    };

    p.draw = () => {
      p.background(220);
      p.fill(0)
      
      for (var i = 0; i < p.rows; i++) {
        //place years
        p.text(d[i][0], i * 30 + 60, 420);
        
        //draw graph
        p.rect(i * 30 + 60, 400 - d[i][1], 20,d[i][1])
      }
       //determine highest value
       let maxValue=p.max;
      for (var k=0;k<maxValue;k=k+50){
        p.text(k,10,420-k);
      }
    };
  }
  
  
}
