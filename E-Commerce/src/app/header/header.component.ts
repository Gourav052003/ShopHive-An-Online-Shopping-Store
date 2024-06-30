import {
  Component,
  ElementRef,
  Type,
  ViewChild,
  ViewContainerRef,
  EventEmitter,
  Output
} from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Category, NavigationItem } from '../models/models';
import { RegisterComponent } from '../register/register.component';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';
import { Router } from '@angular/router'; 

import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent {
  @ViewChild('modalTitle') modalTitle!: ElementRef;
  @ViewChild('container', { read: ViewContainerRef, static: true })  
  container!: ViewContainerRef;

  cartItems: number = 0;
  AccountUsername!:string;
  ProductSearchForm!: FormGroup;

  navigationList: NavigationItem[] = [];
  constructor(
    
    private router: Router, 
    private fb: FormBuilder,
    private navigationService: NavigationService,
    public utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    // Get Category List
    this.navigationService.getCategoryList().subscribe((list: Category[]) => {
      for (let item of list) {
        let present = false;
        for (let navItem of this.navigationList) {
          if (navItem.category === item.category) {
            navItem.subcategories.push(item.subCategory);
            present = true;
          }
        }
        if (!present) {
          this.navigationList.push({
            category: item.category,
            subcategories: [item.subCategory],
          });
        }
      }
    });

    // Cart
    if (this.utilityService.isLoggedIn()) {
      this.navigationService
        .getActiveCartOfUser(this.utilityService.getUser().id)
        .subscribe((res: any) => {
          this.cartItems = res.cartItems.length;
          this.AccountUsername = `${this.utilityService.getUser().firstName} ${this.utilityService.getUser().lastName}`; 
        });
    }

    this.utilityService.changeCart.subscribe((res: any) => {
      if (parseInt(res) === 0) this.cartItems = 0;
      else this.cartItems += parseInt(res);
    });


    this.ProductSearchForm = this.fb.group({
        productName:''   
      })


  }

  openModal(name: string) {
    this.container.clear();

    let componentType!: Type<any>;
    if (name === 'login') {
      componentType = LoginComponent;
      this.modalTitle.nativeElement.textContent = 'Enter Login Information';
    }
    if (name === 'register') {
      componentType = RegisterComponent;
      this.modalTitle.nativeElement.textContent = 'Enter Register Information';
    }

    this.container.createComponent(componentType);
  }

  get ProductName():string{
    return this.ProductSearchForm.get('productName')?.value;
  }

  searchProduct(){

    let SearchedProductName = this.ProductSearchForm.get('productName')?.value;

    location.replace(`http://localhost:4200/search-products;product=${SearchedProductName}`);
      
  }

}





