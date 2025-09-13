import { Component, HostListener } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  selectedChart: string = 'Line';
  selectedPeriod: string = 'All';
  theme: string = 'light';
  availableYears: string[] = ['2020', '2021', '2022', '2023', '2024', '2025'];
  selectedYear: string = '';
  availableMonths: string[] = ['Jan-2025', 'Feb-2025', 'Mar-2025', 'Avr-2025', 'Mai-2025', 'Jun-2025', 'Jul-2025', 'Aou-2025', 'Sep-2025', 'Oct-2025', 'Nov-2025', 'Dec-2025'];
  selectedMonth: string = '';
  dropdownOpenYear = false;
  dropdownOpenMonth = false;

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => {
      this.theme = t;
    });
    console.log('Selected year:', this.selectedYear);
    console.log('Selected month:', this.selectedMonth);

  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.year')) {
      this.dropdownOpenYear = false;
    }
    if (!target.closest('.month')) {
      this.dropdownOpenMonth = false;
    }
  }
  //  ********************************************************************** Filter with Year **********************************************************************
  toggleDropdownYear() {
    this.dropdownOpenYear = !this.dropdownOpenYear;
    this.dropdownOpenMonth = false;
  }
  selectYear(year: string) {
    this.selectedYear = year;
    this.selectedMonth = '';
    this.dropdownOpenYear = false;
  }
  //  ********************************************************************** Filter with Month **********************************************************************
  toggleDropdownMonth() {
    this.dropdownOpenMonth = !this.dropdownOpenMonth;
    this.dropdownOpenYear = false;
  }
  selectMonth(month: string) {
    this.selectedMonth = month;
    this.selectedYear = '';
    this.dropdownOpenMonth = false;
  }

  //  ********************************************************************** Select chart method and period **********************************************************************
  displayChart(item: string) {
    this.selectedChart = item;
    this.selectedYear = '';
    this.selectedMonth = '';
  }
  displayPeriod(item: string) {
    this.selectedPeriod = item;
    this.selectedYear = '';
    this.selectedMonth = '';
  }

  //  ********************************************************************** Chart Data **********************************************************************
  // Line Chart
  lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      { data: [12, 19, 15, 22, 30, 28, 35], label: 'Historic', fill: false, tension: 0.4, borderColor: '#4e79a7', backgroundColor: '#4e79a7' },
      { data: [8, 14, 20, 18, 25, 30, 27], label: 'Science', fill: false, tension: 0.4, borderColor: '#59a14f', backgroundColor: '#59a14f' },
      { data: [5, 10, 12, 20, 18, 22, 25], label: 'Literature', fill: false, tension: 0.4, borderColor: '#f28e2b', backgroundColor: '#f28e2b' },
      { data: [7, 9, 14, 16, 19, 23, 21], label: 'Technology', fill: false, tension: 0.4, borderColor: '#e15759', backgroundColor: '#e15759' },
      { data: [10, 12, 18, 25, 28, 35, 40], label: 'Philosophy', fill: false, tension: 0.4, borderColor: '#76b7b2', backgroundColor: '#76b7b2' }
    ]
  };
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  // Bar Chart
  barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      { data: [44, 55, 41, 64, 22, 43, 21], label: 'AVAILABLE', backgroundColor: '#2ecc71' },
      { data: [54, 55, 51, 65, 52, 45, 25], label: 'BORROWED', backgroundColor: '#e74c3c' },
      { data: [44, 55, 41, 64, 22, 43, 21], label: 'RESERVED', backgroundColor: '#f39c12' }
    ]
  };
  barChartOptions: ChartOptions<'bar'> = { responsive: true };

  // Donut Chart
  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Arabic', 'French', 'English'],
    datasets: [
      { data: [44, 25, 31], backgroundColor: ['#f4a261', '#2a9d8f', '#264653'] }
    ]
  };
  doughnutChartOptions: ChartOptions<'doughnut'> = { responsive: true };
}

