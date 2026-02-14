import { apiCall } from "@/apiActions/api-actions";
import { base_url, endpoints } from "@/apiActions/environment";
import { useProductStore } from "@/store/product-store";
import type { Pagination, Product } from "@/types/product";

interface IProductService {
  readonly getAllProducts: (parms?: IGetAllProductsParams) => void;
  readonly getProductById: (id: string) => Promise<Product>;
}

interface IGetAllProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  material?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}

interface IGetAllProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: Pagination;
  };
}

interface IGetProductByIdResponse {
  success: boolean;
  product: Product;
}

class ProductService implements IProductService {
  private static instance: ProductService;

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  private setIsLoading(isLoading: boolean): void {
    useProductStore.setState({ isLoading });
  }

  public async getAllProducts(params?: IGetAllProductsParams): Promise<void> {
    this.setIsLoading(true);
    const url = base_url + endpoints.get_products;
    try {
      const response = await apiCall<
        IGetAllProductsResponse,
        IGetAllProductsParams,
        undefined
      >("GET", url, params);
      if (response.success) {
        useProductStore.setState({
          products: response.data.products,
          meta: response.data.pagination,
        });
      }
    } catch (error) {
      console.error("Error getting all products", error);
      throw error;
    } finally {
      this.setIsLoading(false);
    }
  }

  public async getProductById(id: string): Promise<Product> {
    this.setIsLoading(true);
    const url = base_url + endpoints.get_product.replace(":id", id);
    try {
      const response = await apiCall<
        IGetProductByIdResponse,
        undefined,
        undefined
      >("GET", url);
      return response.product;
    } catch (error) {
      console.error("Error getting product by id", error);
      throw error;
    } finally {
      this.setIsLoading(false);
    }
  }
}

export const productService = ProductService.getInstance();
