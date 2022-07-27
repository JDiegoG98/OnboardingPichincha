import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-visualizer',
  templateUrl: './book-visualizer.component.html',
  styleUrls: ['./book-visualizer.component.scss']
})
export class BookVisualizerComponent implements OnInit {
  @Input() imgUrl = '';

  constructor() { }

  ngOnInit(): void {
  }

}
