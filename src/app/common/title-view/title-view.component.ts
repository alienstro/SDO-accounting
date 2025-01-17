import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-view',
  standalone: true,
  imports: [],
  templateUrl: './title-view.component.html',
  styleUrl: './title-view.component.css'
})
export class TitleViewComponent {

  @Input() title: string = ''
}
