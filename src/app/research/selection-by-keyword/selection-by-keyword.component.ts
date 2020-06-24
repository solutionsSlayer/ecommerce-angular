import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection-by-keyword',
  templateUrl: './selection-by-keyword.component.html',
  styleUrls: ['./selection-by-keyword.component.scss']
})
export class SelectionByKeywordComponent implements OnInit {
  lastKeyPress: number = 0;

  constructor(private route: Router) { }

  ngOnInit(): void {
  
  }

  selection($event) {
    let terms = $event.target.value;

    if($event.timeStamp - this.lastKeyPress > 200) {
      this.route.navigate(['/research', { outlets: { 'display' : ['display', terms] } }])
    }

    this.lastKeyPress = $event.timeStamp;
  }
}
