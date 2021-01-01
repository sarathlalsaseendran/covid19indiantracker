import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from './data.service'
import { ModalService } from './modal/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private service: DataService,
    private datepipe: DatePipe,
    private modalService: ModalService) { }

  title = 'covid19indiantracker';
  isMobileVersion: boolean;
  date: Date;
  stateWiseData: any;
  stateName: string;
  selectedState: any;
  states: any;
  population: number;
  totalTested: number;
  deltaTested: number;
  totalConfirmed: number;
  deltaConfirmed: number;
  totalRecovered: number;
  deltaRecovered: number;
  totalDeceased: number;
  deltaDeceased: number;
  totalMigrated: number;

  @ViewChild('btnShowModal', { static: false }) btnShowModal: ElementRef<HTMLElement>;

  ngOnInit() {
    this.selectedState = null;
    this.date = new Date();
    this.getStateData('');
    this.getStates();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  getStates() {
    this.states = this.service.getStates()
  }

  getStateData(date: string) {
    let value = (date == '') ? '' : '-' + date;
    this.service.getStateData(value).subscribe(
      response => {
        this.stateWiseData = response;
      }, error => {
        this.date = new Date();
        this.getStateData('');
      }
    );
  }

  dateChanged() {
    this.selectedState = null;
    if (this.date > new Date()) {
      this.getStateData('');
    }
    else if (this.datepipe.transform(this.date, 'yyyy-MM-dd') == this.datepipe.transform(new Date(), 'yyyy-MM-dd')) {
      this.getStateData('');
    }
    else {
      this.getStateData(this.datepipe.transform(this.date, 'yyyy-MM-dd'));
    }
  }

  postDateFilter = (dt: Date): boolean => {
    return dt <= new Date() && dt > new Date('2020-03-01');
  }

  onStateSelected() {
    this.stateName = this.states.find(x => x.key == this.selectedState.key).name;
    var data = this.stateWiseData[this.selectedState.key];
    this.population = (data?.meta?.population == undefined) ? 0 : data?.meta?.population;
    this.totalTested = (data?.total?.tested == undefined) ? 0 : data?.total?.tested;
    this.deltaTested = data?.delta?.tested;
    this.totalConfirmed = (data?.total?.confirmed == undefined) ? 0 : data?.total?.confirmed;
    this.deltaConfirmed = data?.delta?.confirmed;
    this.totalRecovered = (data?.total?.recovered == undefined) ? 0 : data?.total?.recovered;
    this.deltaRecovered = data?.delta?.recovered;
    this.totalDeceased = (data?.total?.deceased == undefined) ? 0 : data?.total?.deceased;
    this.deltaDeceased = data?.delta?.deceased;
    this.totalMigrated = (data?.total?.migrated == undefined) ? 0 : data?.total?.migrated;
  }

  report(stateCode: string, stateName: string) {
    this.selectedState = null;
    this.stateName = stateName;
    var data = this.stateWiseData[stateCode];
    this.population = (data?.meta?.population == undefined) ? 0 : data?.meta?.population;
    this.totalTested = (data?.total?.tested == undefined) ? 0 : data?.total?.tested;
    this.deltaTested = data?.delta?.tested;
    this.totalConfirmed = (data?.total?.confirmed == undefined) ? 0 : data?.total?.confirmed;
    this.deltaConfirmed = data?.delta?.confirmed;
    this.totalRecovered = (data?.total?.recovered == undefined) ? 0 : data?.total?.recovered;
    this.deltaRecovered = data?.delta?.recovered;
    this.totalDeceased = (data?.total?.deceased == undefined) ? 0 : data?.total?.deceased;
    this.deltaDeceased = data?.delta?.deceased;
    this.totalMigrated = (data?.total?.migrated == undefined) ? 0 : data?.total?.migrated;
    let el: HTMLElement = this.btnShowModal.nativeElement;
    el.click();
  }
}
