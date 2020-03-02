import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
@Component({
  selector: 'home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private page: Page) {}
  mapView: MapView;
  startPoint: string;
  endPoint: string;
  latitude = 4.0832;
  longitude = 9.7803;
  zoom = 20;
  minZoom = 0;
  maxZoom = 100;
  bearing = 0;
  tilt = 0;
  padding = [10, 10, 10, 10];
  lastCamera: String;

  ngOnInit(): void {}

  onMapReady(event) {
    console.log('Map Ready');

    this.mapView = event.object as MapView;

    console.log('Setting a marker...');

    const marker = new Marker();
    marker.position = Position.positionFromLatLng(4.0832, 9.7803);
    marker.title = 'IUC';
    marker.snippet = 'Douala';
    marker.userData = { index: 1 };
    this.mapView.addMarker(marker);
  }

  onCoordinateTapped(args) {
    console.log(
      'Coordinate Tapped, Lat: ' +
        args.position.latitude +
        ', Lon: ' +
        args.position.longitude,
      args
    );
  }

  onMarkerEvent(args) {
    console.log(
      `Marker Event:${args.eventName} triggered on: ${args.marker.title}, Lat: ${args.marker.position.latitude}, Lon: ${args.marker.position.longitude}`,
      args
    );
  }

  onCameraChanged(args) {
    // console.log(
    //   'Camera changed: ' + JSON.stringify(args.camera),
    //   JSON.stringify(args.camera) === this.lastCamera
    // );
    // this.lastCamera = JSON.stringify(args.camera);
  }

  onCameraMove(args) {
    // console.log('Camera moving: ' + JSON.stringify(args.camera));
  }
}
