import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RevokedCertificateService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getAllRevokeCertificates(): Observable<any> {
    return this.http.get(`${this.baseUrl}certificate/revoke`);
  }

}
