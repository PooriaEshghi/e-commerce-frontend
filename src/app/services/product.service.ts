import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  private adminUrl = 'http://localhost:8080/api/admin/products';

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetResponseProducts> {

    // Category 0 is the All view: every product, not only Books.
    const searchUrl = theCategoryId > 0
                    ? `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`
                    : `${this.baseUrl}?page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, 
                        thePageSize: number, 
                        theKeyword: string): Observable<GetResponseProducts> {

    // need to build URL based on keyword, page and size 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }



  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getAdminProducts(): Observable<AdminProduct[]> {
    return this.httpClient.get<AdminProduct[]>(this.adminUrl);
  }

  getAdminProduct(productId: number): Observable<AdminProduct> {
    return this.httpClient.get<AdminProduct>(`${this.adminUrl}/${productId}`);
  }

  createProduct(product: NewProduct): Observable<AdminProduct> {
    return this.httpClient.post<AdminProduct>(this.adminUrl, this.toAdminBody(product));
  }

  updateProduct(productId: number, product: NewProduct): Observable<AdminProduct> {
    return this.httpClient.put<AdminProduct>(`${this.adminUrl}/${productId}`, this.toAdminBody(product));
  }

  uploadProductImage(file: File): Observable<UploadedImage> {
    const body = new FormData();
    body.append('file', file);
    return this.httpClient.post<UploadedImage>(`${this.adminUrl}/images`, body);
  }

  private toAdminBody(product: NewProduct) {
    return {
      sku: product.sku,
      name: product.name,
      description: product.description,
      unitPrice: product.unitPrice,
      unitsInStock: product.unitsInStock,
      categoryId: Number(product.categoryId),
      imageUrl: product.imageUrl,
      active: product.active
    };
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

export interface NewProduct {
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  unitsInStock: number;
  categoryId: number;
  imageUrl: string;
  active: boolean;
}

export interface UploadedImage {
  imageUrl: string;
}

export interface AdminProduct {
  id: number;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  unitsInStock: number;
  categoryId: number;
  imageUrl: string;
  active: boolean;
}