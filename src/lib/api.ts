const API_BASE_URL = 'http://localhost:8000';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  part_suggestions?: Product[];
  sources?: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  compatible_models: string[];
  installation_guide: string;
  image_url?: string;
}

export interface CompatibilityCheck {
  part_number: string;
  model_number: string;
}

export interface CompatibilityResponse {
  compatible: boolean;
  message: string;
  compatible_models?: string[];
  product?: Product;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async checkCompatibility(
    partNumber: string,
    modelNumber: string
  ): Promise<CompatibilityResponse> {
    return this.request<CompatibilityResponse>('/api/compatibility', {
      method: 'POST',
      body: JSON.stringify({
        part_number: partNumber,
        model_number: modelNumber,
      }),
    });
  }

  async getProducts(search?: string, category?: string): Promise<{ products: Product[] }> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    const queryString = params.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ products: Product[] }>(endpoint);
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request<{ status: string; service: string }>('/health');
  }
}

export const apiService = new ApiService();