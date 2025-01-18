import { Component, Input } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-view',
  standalone: true,
  imports: [PdfViewerModule],
  templateUrl: './pdf-view.component.html',
  styleUrl: './pdf-view.component.css'
})
export class PdfViewComponent {

  @Input() src: string = ''
}
