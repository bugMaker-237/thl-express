import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'history-list',
  styleUrls: ['history-list.component.scss'],
  templateUrl: 'history-list.component.html'
})
export class HistoryListComponent implements OnInit {
  histories = [
    {
      id: 1,
      date: '10 Fevrier 2020, 19:11',
      price: '1 500',
      start: 'Carrefour Mvan',
      end: 'Chapele Obili'
    },
    {
      id: 2,
      date: '19 Janvier, 12:17',
      price: '500',
      start: 'Bonamoussadi',
      end: 'Ecole publique Deido'
    }
  ];
  ngOnInit() {
    this.histories = [
      ...this.histories,
      ...this.histories,
      ...this.histories,
      ...this.histories,
      ...this.histories
    ];
  }
}
