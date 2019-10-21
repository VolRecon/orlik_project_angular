import { Injectable } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class NodeService {

  constructor(private http: HttpClient) {}

  getAPIData(){
    return this.http.get('http://localhost:4200');
  }

  //sprawdzenie rezerwacji 
  sendToAPIData(minMax){
    return this.http.post('http://localhost:3000/rezerwacja', minMax, httpOptions); 
  }

  // dodawanie nowego eventu
  addEvent(data){
    return this.http.post('http://localhost:3000/rezerwacja/finalizacja', data, httpOptions); 
  }

}
