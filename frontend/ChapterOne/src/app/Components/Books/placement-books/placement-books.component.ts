import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-placement-books',
  templateUrl: './placement-books.component.html',
  styleUrls: ['./placement-books.component.css']
})
export class PlacementBooksComponent implements OnInit {
  theme: string = 'light';
  searchTerm: string = '';

  constructor(private themeService: ThemeService,
    private router: Router) { }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => {
      this.theme = t;
    });
    localStorage.setItem('placement', '')
  }

  detailPlacement(placement: string) {
    localStorage.setItem('placement', placement)
    console.log(placement)
    this.router.navigate(['/Dashboard/PlacementDetails']);

  }

  fakeplacement = [
    {
      name: 'fiction',
      number: '000 - 099'
    },
    {
      name: 'fiction',
      number: '100 - 199'
    },
    {
      name: 'fiction',
      number: '200 - 299'
    },
    {
      name: 'fiction',
      number: '300 - 399'
    },
    {
      name: 'fiction',
      number: '400 - 499'
    },
    {
      name: 'fiction',
      number: '500 - 599'
    },
    {
      name: 'fiction',
      number: '600 - 699'
    },

    {
      name: 'fiction',
      number: '700 - 799'
    },
    {
      name: 'fiction',
      number: '800 - 899'
    },
    {
      name: 'fiction',
      number: '900 - 999'
    },
    {
      name: 'fiction',
      number: 'T'
    },
    {
      name: 'fiction',
      number: 'N'
    },
    {
      name: 'fiction',
      number: 'G'
    },
    {
      name: 'fiction',
      number: 'F'
    },
  ]
}
