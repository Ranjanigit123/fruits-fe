// app.component.ts

//import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent }
  from './navbar/navbar.component';
import { ResturentCardComponent }
  from './product-card/product-card.component';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
//import { NavbarComponent_1 as NavbarComponent } from "./navbar/navbar.component";

  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    NavbarComponent,
    
    ResturentCardComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
   
],
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'Restro - find your restaurant';
  rating = new FormControl('');
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];
  searchResults: string[] = [];
  searchText: string = '';
  cartTotal: number = 0;
  minPrice = new FormControl('');
  maxPrice = new FormControl('');
  minFilterPrice: number | null = null;
  maxFilterPrice: number | null = null;

  constructor(private http: HttpClient, private router: Router) { }
  

  ngOnInit() {
    this.getRestaurants();
  }

  getRestaurants() {
    this.http.get('https://fruits-be.onrender.com/api/products').subscribe(
      (response: any) => {
        if (response.success) {
          this.restaurants = response.data;
          this.filterRestaurants();
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  filterRestaurants() {
    this.filteredRestaurants = this.restaurants.filter((restaurant) => {
      let passType = true;
      if (this.rating.value === 'Fruit') {
        passType = restaurant.type === 'Fruit';
      } else if (this.rating.value === 'Vegetable') {
        passType = restaurant.type === 'Vegetable';
      }

      let passPriceRange = true;
      if (this.minFilterPrice !== null) {
        passPriceRange = restaurant.price >= this.minFilterPrice;
      }
      if (this.maxFilterPrice !== null) {
        passPriceRange = passPriceRange && restaurant.price <= this.maxFilterPrice;
      }

      return passType && passPriceRange;
    });
  }
  
  filterByRange() {
    const minValue = this.minPrice.value;
    const maxValue = this.maxPrice.value;
    if (minValue !== null && maxValue !== null) {
      const minPrice = +minValue;
      const maxPrice = +maxValue;

      if (!isNaN(minPrice) && !isNaN(maxPrice) && maxPrice >= minPrice) {
        this.minFilterPrice = minPrice;
        this.maxFilterPrice = maxPrice;
        this.filterRestaurants();
      } else {
        alert("Invalid price range");
      }
    }
  }

  applySearch(): void {
    this.filteredRestaurants = this.restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  addToCart(price: number): void {
    this.cartTotal += price;
  }

  removeFromCart(price: number): void {
    if (this.cartTotal > 0) {
      this.cartTotal -= price;
    } else if(this.cartTotal === 0) {
      // Optionally handle negative total or alert users
      alert("No Item")
      return;
    }
  }
  sortByPrice() {
    this.filteredRestaurants.sort((a, b) => a.price - b.price);
  }
  
}