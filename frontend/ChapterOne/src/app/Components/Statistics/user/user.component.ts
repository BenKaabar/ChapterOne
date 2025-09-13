import { Component, HostListener } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ThemeService } from 'src/app/Services/theme.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
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
      {
        data: [31, 40, 28, 51, 42, 109, 100],
        label: 'Children',
        fill: false,
        tension: 0.4,
        borderColor: '#4e79a7',
        backgroundColor: '#4e79a7'
      },
      {
        data: [11, 32, 45, 32, 34, 52, 41],
        label: 'Youths',
        fill: false,
        tension: 0.4,
        borderColor: '#59a14f',
        backgroundColor: '#59a14f'
      },
      {
        data: [11, 32, 45, 132, 314, 152, 141],
        label: 'Old',
        fill: false,
        tension: 0.4,
        borderColor: '#f28e2b',
        backgroundColor: '#f28e2b'
      }
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
      { data: [44, 55, 41, 64, 22, 43, 21], label: 'Male', backgroundColor: '#42A5F5' },
      { data: [54, 55, 51, 65, 52, 45, 25], label: 'Female', backgroundColor: '#f54242ff' }
    ]
  };
  barChartOptions: ChartOptions<'bar'> = { responsive: true };

  // Donut Chart
  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Active users', 'Inactive users', 'Blocked users'],
    datasets: [
      { data: [44, 25, 31], backgroundColor: ['#2bff00ff', '#3636ebff', '#ff5659ff'] }
    ]
  };
  doughnutChartOptions: ChartOptions<'doughnut'> = { responsive: true };
}

