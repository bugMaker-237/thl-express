import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pay-service',
  templateUrl: 'pay-service.component.html',
  styleUrls: ['pay-service.component.scss']
})
export class PayServiceComponent implements OnInit {
  service = {
    price: '2 300',
    origin: 'Bessengue, Douala',
    destination: 'Ecole publique deido'
  };
  buyer = {};
  ngOnInit() {}
}
