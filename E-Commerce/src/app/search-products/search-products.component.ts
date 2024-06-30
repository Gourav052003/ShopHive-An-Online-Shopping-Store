import { Component,Input,OnInit,OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from '../services/utility.service';


@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.css'
})

export class SearchProductsComponent {

  view: 'grid' | 'list' = 'list';
  sortby: 'default' | 'htl' | 'lth' = 'default';
  @Input() searchedProducts:Product[] = [];
  @Input() productName!:string;  

  constructor(
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    private utilityService: UtilityService
    
  ) {}

  
  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe(params => {

    this.productName= this.activatedRoute.snapshot.params['product'];
    
    this.navigationService.searchProduct(this.productName).subscribe((res: any) => {
      
      this.searchedProducts = res;
  
     
    });
      
 
    })

  }

  
  sortByPrice(sortKey: string) {
    this.searchedProducts.sort((a, b) => {
      if (sortKey === 'default') {
        return a.id > b.id ? 1 : -1;
      }
      return (
        (sortKey === 'htl' ? 1 : -1) *
        (this.utilityService.applyDiscount(a.price, a.offer.discount) >
        this.utilityService.applyDiscount(b.price, b.offer.discount)
          ? -1
          : 1)
      );
    });
  }

}
