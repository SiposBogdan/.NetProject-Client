import { Component, inject } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import {MatCard} from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatMenuTrigger } from '@angular/material/menu';
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  title = 'Skinet';
  products?: Pagination<Product>;
  pageSizeOptions = [5, 10, 15, 20];
  


  sortOptions = [
    {name: 'Alphabetical', value: 'name'}, 
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'}
  ]
  shopParams = new ShopParams();

  
  ngOnInit(): void {
    //this.http.get<Pagination<Product>>(this.baseUrl + 'products').subscribe({
      this.initializeShop();

  }
  

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (response) => this.products = response,
      error: (error) => console.log(error)
    })
  
  }

  handlePageChange(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOptions = event.options[0];
    if (selectedOptions) {
      this.shopParams.sort = selectedOptions.value;
      this.shopParams.pageNumber = 1; // Reset to first page on sort change
      this.getProducts();
    }
  }

  onSearchChange(){
    this.shopParams.pageNumber = 1; // Reset to first page on search change
    this.getProducts();
  }

  openFilterDialog() {
    const dialogRef = this.dialogService.open(FilterDialogComponent, {
      width: '500px',
      data: { 
        selectedBrands: this.shopParams.brands, 
        selectedTypes: this.shopParams.types }
    });


    dialogRef.afterClosed().subscribe({
      next: result => {
        if(result) {
          console.log(result);
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1; // Reset to first page on filter change
          this.getProducts();
        }
      }
    });
  }
}