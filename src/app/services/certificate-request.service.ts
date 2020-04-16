import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateRequestService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }


  public createRequest(body): Observable<any> {
    return this.http.post(`${this.baseUrl}certificate-requests`, body);
  }

  public getIssuersExpirationDate(body): Observable<any> {
    return this.http.post(`${this.baseUrl}certificate-requests/issuer`, body);
  }

  public approveCertificateRequest(body): Observable<any> {
    return this.http.post(`${this.baseUrl}certificate-requests/approve`, body);
  }

  public getPossibleExtensions(body): Observable<any> {
    return this.http.post(`${this.baseUrl}certificate-requests/possible-extensions`, body);
  }
}
