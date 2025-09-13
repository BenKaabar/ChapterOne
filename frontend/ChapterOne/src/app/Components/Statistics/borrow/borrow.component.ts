import { Component, HostListener } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css']
})
export class BorrowComponent {
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
      { data: [31, 40, 28, 51, 42, 109, 100], label: 'Borrowed by Children', fill: false, tension: 0.4, borderColor: '#4e79a7', backgroundColor: '#4e79a7' },
      { data: [11, 32, 45, 32, 34, 52, 41], label: 'Borrowed by Youths', fill: false, tension: 0.4, borderColor: '#59a14f', backgroundColor: '#59a14f' },
      { data: [11, 32, 45, 132, 314, 152, 141], label: 'Borrowed by Old', fill: false, tension: 0.4, borderColor: '#f28e2b', backgroundColor: '#f28e2b' }
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
      { data: [120, 98, 110, 150, 130, 90, 100], label: 'Total Borrowed Books', backgroundColor: '#42A5F5' },
      { data: [80, 70, 75, 100, 85, 60, 70], label: 'Currently Borrowed (On Time)', backgroundColor: '#66BB6A' },
      { data: [10, 15, 12, 20, 18, 10, 12], label: 'Overdue Books (Late)', backgroundColor: '#FFA726' }
    ]
  };
  barChartOptions: ChartOptions<'bar'> = { responsive: true };

  // Donut Chart
  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Historic', 'Science', 'Literature', 'Technology', 'Philosophy'],
    datasets: [
      { data: [12, 8, 5, 7, 10], backgroundColor: ['#4e79a7', '#59a14f', '#f28e2b', '#e15759', '#76b7b2'] }
    ]
  };
  doughnutChartOptions: ChartOptions<'doughnut'> = { responsive: true };
}

