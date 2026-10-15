import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategory } from 'src/app/common/product-category';
import { AdminProduct, ProductService } from 'src/app/services/product.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {

  productFormGroup: FormGroup;
  productCategories: ProductCategory[] = [];
  catalog: AdminProduct[] = [];
  editingId: number = null;
  successMessage = '';
  errorMessage = '';

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.productFormGroup = this.formBuilder.group({
      sku: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
      name: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
      description: new FormControl(''),
      unitPrice: new FormControl('', [Validators.required, Validators.min(0.01)]),
      unitsInStock: new FormControl(0, [Validators.required, Validators.min(0)]),
      categoryId: new FormControl('', [Validators.required]),
      imageUrl: new FormControl(''),
      active: new FormControl(true)
    });

    this.productService.getProductCategories().subscribe({
      next: data => this.productCategories = data,
      error: () => this.errorMessage = 'Could not load categories. Is the backend running?'
    });
    this.loadCatalog();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.successMessage = '';
      this.editingId = id ? +id : null;
      if (this.editingId) {
        this.loadProduct(this.editingId);
      } else {
        this.resetForm();
      }
    });
  }

  get sku() { return this.productFormGroup.get('sku'); }
  get name() { return this.productFormGroup.get('name'); }
  get unitPrice() { return this.productFormGroup.get('unitPrice'); }
  get unitsInStock() { return this.productFormGroup.get('unitsInStock'); }
  get categoryId() { return this.productFormGroup.get('categoryId'); }
  get imageUrl() { return this.productFormGroup.get('imageUrl'); }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length > 0 ? input.files[0] : null;
    if (!file) {
      return;
    }
    this.errorMessage = '';
    this.productService.uploadProductImage(file).subscribe({
      next: response => this.productFormGroup.patchValue({ imageUrl: response.imageUrl }),
      error: err => this.errorMessage = err?.error?.message || 'Could not upload the image.'
    });
  }

  categoryName(categoryId: number): string {
    const category = this.productCategories.find(item => +item.id === +categoryId);
    return category ? category.categoryName : '';
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.productFormGroup.invalid) {
      this.productFormGroup.markAllAsTouched();
      return;
    }

    const formValue = this.productFormGroup.value;
    const payload = {
      sku: formValue.sku,
      name: formValue.name,
      description: formValue.description,
      unitPrice: formValue.unitPrice,
      unitsInStock: formValue.unitsInStock,
      categoryId: formValue.categoryId,
      imageUrl: formValue.imageUrl,
      active: formValue.active
    };
    const save = this.editingId
      ? this.productService.updateProduct(this.editingId, payload)
      : this.productService.createProduct(payload);

    save.subscribe({
      next: product => {
        this.loadCatalog();
        if (this.editingId) {
          this.successMessage = `Updated “${product.name}”.`;
          return;
        }
        this.router.navigateByUrl(`/products/${product.id}`);
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Could not save the product.';
      }
    });
  }

  private loadCatalog(): void {
    this.productService.getAdminProducts().subscribe({
      next: data => this.catalog = data,
      error: () => this.errorMessage = 'Could not load the catalog.'
    });
  }

  private loadProduct(productId: number): void {
    this.productService.getAdminProduct(productId).subscribe({
      next: product => {
        this.productFormGroup.patchValue({
          sku: product.sku,
          name: product.name,
          description: product.description,
          unitPrice: product.unitPrice,
          unitsInStock: product.unitsInStock,
          categoryId: String(product.categoryId),
          imageUrl: product.imageUrl,
          active: product.active
        });
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Could not load the product.';
      }
    });
  }

  private resetForm(): void {
    this.productFormGroup.reset({
      sku: '',
      name: '',
      description: '',
      unitPrice: '',
      unitsInStock: 0,
      categoryId: '',
      imageUrl: '',
      active: true
    });
  }
}
