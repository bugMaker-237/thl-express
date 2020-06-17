import { Component, OnInit } from '@angular/core';
import { DocumentsService } from './documents.service';

@Component({
  selector: 'map',
  moduleId: module.id,
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [DocumentsService],
})
export class DocumentsComponent implements OnInit {
  constructor(private _docsService: DocumentsService) {}

  ngOnInit() {}
}
