import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, state, style, animate, transition } from '@angular/animations';


interface Campaign {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in'),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent implements AfterViewInit{
  isFlipped: boolean = false;
  filtersApplied: boolean = false;

  displayedColumns: string[] = ['status', 'name', 'startDate', 'endDate', 'budget'];
  dataSource: MatTableDataSource<Campaign>;

  campaigns: Campaign[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;


  results?: any[];
  view: [number, number] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      filterName: [null],
      fromDate: [null],
      toDate: [null]
    });

    this.addCampaigns([
      { id: 1, name: "Divavu", startDate: "9/19/2017", endDate: "3/9/2024", budget: 88377 },
      { id: 2, name: "Jaxspan", startDate: "11/21/2017", endDate: "2/21/2018", budget: 608715 },
      { id: 3, name: "Miboo", startDate: "11/1/2017", endDate: "6/20/2017", budget: 239507 },
      { id: 4, name: "Trilith", startDate: "8/25/2017", endDate: "11/30/2017", budget: 179838 },
      { id: 5, name: "Layo", startDate: "11/28/2017", endDate: "3/10/2018", budget: 837850 },
      { id: 6, name: "Photojam", startDate: "7/25/2017", endDate: "6/23/2017", budget: 858131 },
      { id: 7, name: "Blogtag", startDate: "6/27/2017", endDate: "1/15/2018", budget: 109078 },
      { id: 8, name: "Rhyzio", startDate: "10/13/2017", endDate: "1/25/2018", budget: 272552 },
      { id: 9, name: "Zoomcast", startDate: "9/6/2017", endDate: "11/10/2017", budget: 301919 },
      { id: 10, name: "Realbridge", startDate: "3/5/2018", endDate: "10/2/2017", budget: 505602 }
    ]);

    this.dataSource = new MatTableDataSource(this.campaigns);
    this.updateResults(this.campaigns);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public addCampaigns(campaigns: Campaign[]){
    this.campaigns = this.campaigns.concat(campaigns);
    if(this.dataSource){
      this.dataSource._updateChangeSubscription();
    }
  }

  updateResults(newResults: Campaign[]){
    const extractedValues = newResults.map((campaign) => ({
      name: campaign.name,
      value: campaign.budget,
    }));

    this.results = extractedValues;
  }

  checkFilter(){
    const fromDate = this.filterForm.get('fromDate')?.value;
    const toDate = this.filterForm.get('toDate')?.value;
    const filterName = this.filterForm.get('filterName')?.value;


    if(fromDate === null && toDate === null && filterName === null){
      this.filtersApplied = false;
    }
    else{
      this.filtersApplied = true;
    }
  }

  applyFilter() {
    this.dataSource.filter = this.filterForm.get('filterName')?.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    const filteredData = this.dataSource.filteredData;

    this.updateResults(filteredData);
    this.checkFilter();
  }

  updateFromDateFilter() {
    const fromDate = this.filterForm.get('fromDate')?.value;
    const toDate = this.filterForm.get('toDate')?.value;

    this.dataSource.data = this.campaigns.filter((campaign) => {
      const campaignStartDate = new Date(campaign.startDate);
      const campaignEndDate = new Date(campaign.endDate);

      // Check if fromDate and toDate are not null
      if (fromDate && toDate) {
        return campaignStartDate >= fromDate && campaignEndDate <= toDate;
      } else if (fromDate) {
        return campaignStartDate >= fromDate;
      } else if (toDate) {
        return campaignEndDate <= toDate;
      } else {
        // If both fromDate and toDate are null, don't filter based on them
        return true;
      }
    });

    this.updateResults(this.dataSource.data);
    this.checkFilter();
  }

  clearFilters(){
    this.filterForm.get('fromDate')?.setValue(null);
    this.filterForm.get('toDate')?.setValue(null);
    this.filterForm.get('filterName')?.setValue(null);

    this.dataSource.data = this.campaigns;
    this.dataSource.filter = '';

    this.filtersApplied = false;

    this.updateResults(this.campaigns);
  }

  isDateInRange(startDate: string, endDate: string): boolean {
    const today = new Date();
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    const dateRange = (today >= parsedStartDate && today <= parsedEndDate);

    return dateRange;
  }
}
