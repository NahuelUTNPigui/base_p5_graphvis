import { Component, OnInit, OnDestroy } from '@angular/core';
import * as  p5 from 'p5';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  private p5:any;
  private origin = { x: 0, y: 0 };
  private toggle = true;
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
    if (this.toggle) {
      this.p5 = new p5(this.drawing);
      this.toggle = !this.toggle;
    } else {
      this.p5.noCanvas();
      this.toggle = !this.toggle;
    }
  }
  private drawing = function (p: any) {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight).parent('digital-watch-canvas');
      p.background(0);
    };

    p.draw = () => {
      const time = {
        hr: p.hour(),
        mn: p.minute(),
        sc: p.second(),
        ms: p.millis()
      };
      const center = {
        x: p.width / 2,
        y: p.height / 2
      };

      p.background(0);

      const clock = time.hr + ':' + time.mn + ':' + time.sc;
      p.fill(255);
      p.noStroke();
      p.textSize(50);
      p.text(clock, center.x, center.y);
    };
  };
}
//////////////////////////  line
/*
private drawing =  (p: any) => {
    let randomY:any=[]
    let numPts:any=25
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight).parent('digital-watch-canvas');
      //p.background(0);
      //console.log(this)
      for(let i =0; i< numPts; i++){
        randomY.push(p.random(100,300)); 
       }
    };

    p.draw = () => {
      p.background(220);
  
      p.noStroke();
      // draw ellipses
      for(let i =0; i < randomY.length; i++){
        let x = i * (p.width / (numPts-1));
        let y = randomY[i];
        p.ellipse(x, y, 7);
      }
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
      /*
      const time = {
        hr: p.hour(),
        mn: p.minute(),
        sc: p.second(),
        ms: p.millis()
      };
      const center = {
        x: p.width / 2,
        y: p.height / 2
      };

      p.background(0);

      const clock = time.hr + ':' + time.mn + ':' + time.sc;
      p.fill(255);
      p.noStroke();
      p.textSize(50);
      p.text(clock, center.x, center.y);
    };
    
*/