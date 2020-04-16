import { Component, OnInit } from '@angular/core';
import {differenceInCalendarDays} from 'date-fns';
import { FormBuilder,Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CertificateRequestService } from 'src/app/services/certificate-request.service';
import { CertificateService } from 'src/app/services/certificate.service';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.css']
})
export class ApproveRequestComponent implements OnInit {

  public issuers: Observable<any> ;
  public selectedIssuer: String;
  public issuerEndDate: String = 'nesto';
  public validateForm: FormGroup;
  public data: any;

  public isVisible1 = false;
  public isVisible2 = false;
  public isVisible3 = false;
  public isVisible4 = false;

  public checked1 = false;
  public checked2 = false;
  public checked3 = false;
  public checked4 = false;
  
  constructor(private message: NzMessageService, private crqService: CertificateRequestService, private crService: CertificateService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.crService.getAllValidCACertificates().subscribe(data1 => {
      this.issuers = data1;
      this.selectedIssuer = this.issuers[0];
    })
    
    this.setupForm();
    this.data = JSON.parse(localStorage.getItem('dataToApprove'));
  }

  public setupForm(): void {
    this.validateForm = this.fb.group({
      endDate: [ null, [Validators.required]]
    });
  }

  issuerSelected = (value:String) : void => {
    const body = {
      email: value
    }
    this.selectedIssuer = value;
    this.crqService.getIssuersExpirationDate(body).subscribe(data => {
      this.issuerEndDate = data.endDate;
    });
  }

  disabledDate = (current: Date): boolean => {
      let year: String = this.issuerEndDate.split('/')[0];
      let month: String = this.issuerEndDate.split('/')[1];
      let day: String = this.issuerEndDate.split('/')[2];
      let parameter: string = year + ',' + month + ',' + day;
      return differenceInCalendarDays(parameter, current) < 0 || differenceInCalendarDays(new Date(), current) > 0;
  };

  fullName = (name:String, lastName: String) : String => {
    return name + " " + lastName;
  }

  public addAnotherExtensions(): void {
    const body = {
      email: this.selectedIssuer
    }
    this.crqService.getPossibleExtensions(body).subscribe(data => {
      if(data.digitalSignature){
        this.isVisible1 = true;
      }
      if(data.keyAgreement){
        this.isVisible2 = true;
      }
      if(data.nonRepudiation){
        this.isVisible3 = true;
      }
      if(data.keyEncipherment){
        this.isVisible4 = true;
      }
    })
  }

  public finish(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    {
      let date = this.validateForm.value.endDate;
      date = date.toISOString().substring(0, 10);
      date = date.replace(/-/g,'/');
      const body = {
        ...this.data,
        certificateAuthority: this.data.caOrEnd == 'End user' ? false : true,
        issuerEmail: this.selectedIssuer,
        endDate: date,
        digitalSignature: this.checked1,
        keyAgreement: this.checked2,
        nonRepudiation: this.checked3,
        keyEncipherment: this.checked4
      }
      delete(body.id);
      delete(body.caOrEnd);
      this.crqService.approveCertificateRequest(body).subscribe(data => {
        this.message.info('Successfully approved!');
        this.router.navigateByUrl('dashboard/certificate-requests');
      })
    }
  }
}