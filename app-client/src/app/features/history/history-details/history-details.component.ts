import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'history-details',
  templateUrl: 'history-details.component.html',
  styleUrls: ['history-details.component.scss']
})
export class HistoryDetailsComponent implements OnInit {
  history = {
    date: '10 Fevrier 2020, 19:11',
    price: '1 500',
    start: 'Carrefour Mvan',
    end: 'Chapele Obili',
    latitude: 4.0832,
    longitude: 9.7803,
    state: 'ANNULER',
    paimentMethod: 'Orange Money',
    driver: {
      firstName: 'John',
      lastName: 'Doe',
      picture: 'https://etienneyamsi.com/images/pp.png',
      immatriculation: 'LT 312 MT',
      driveType: 'Personne'
    }
  };
  ngOnInit() {}
}
