const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fiyat-casusu-production.up.railway.app/api';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token && !skipAuth) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.fetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
    this.setToken(data.token);
    return data;
  }

  async register(email: string, password: string, name: string, companyName?: string) {
    const data = await this.fetch<{ token: string; user: any; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, companyName }),
      skipAuth: true,
    });
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.setToken(null);
  }

  // Products
  async getProducts() {
    return this.fetch<any[]>('/products');
  }

  async getProduct(id: string) {
    return this.fetch<any>(`/products/${id}`);
  }

  async createProduct(product: any) {
    return this.fetch<any>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string) {
    return this.fetch<any>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Competitors
  async getCompetitors() {
    return this.fetch<any[]>('/competitors');
  }

  async createCompetitor(competitor: any) {
    return this.fetch<any>('/competitors', {
      method: 'POST',
      body: JSON.stringify(competitor),
    });
  }

  // Alerts
  async getAlertRules() {
    return this.fetch<any[]>('/alerts/rules');
  }

  async createAlertRule(rule: any) {
    return this.fetch<any>('/alerts/rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    });
  }

  async deleteAlertRule(id: string) {
    return this.fetch<any>(`/alerts/rules/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard
  async getDashboardStats() {
    return this.fetch<any>('/products/stats');
  }

  // Price History
  async getPriceHistory(productId: string) {
    return this.fetch<any[]>(`/products/${productId}/price-history`);
  }
}

export const api = new ApiClient();
