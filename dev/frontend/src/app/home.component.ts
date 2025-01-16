import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <header class="header">
        <h1>Inventory Management System</h1>
        <p>Welcome to your inventory management dashboard. Manage your products, track stock levels, and monitor purchases.</p>
      </header>

      <section class="features">
        <div class="feature-card">
          <h2>📦 Product Management</h2>
          <p>Add, update, or remove products from your inventory with ease.</p>
          <a routerLink="/products" class="btn">Manage Products</a>
        </div>

        <div class="feature-card">
          <h2>📊 Stock Tracking</h2>
          <p>Monitor stock levels in real-time and receive alerts for low stock.</p>
          <a routerLink="/stock" class="btn">Track Stock</a>
        </div>

        <div class="feature-card">
          <h2>🛒 Purchase Tracking</h2>
          <p>Track all purchases, manage suppliers, and analyze purchase trends.</p>
          <a routerLink="/purchases" class="btn">View Purchases</a>
        </div>

        <div class="feature-card">
          <h2>📂 Category Management</h2>
          <p>Organize your products into categories for better inventory management.</p>
          <a routerLink="/categories" class="btn">Manage Categories</a>
        </div>

        <div class="feature-card">
          <h2>💰 Sales Tracking</h2>
          <p>Track sales, analyze revenue, and monitor customer purchase trends.</p>
          <a routerLink="/sales" class="btn">View Sales</a>
        </div>
      
  

        
      </section>
  
    </div>
  `,
  styles: `
    .home-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Arial', sans-serif;
      color: #333;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .header p {
      font-size: 1.2rem;
      color: #7f8c8d;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: #ffffff;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .feature-card h2 {
      font-size: 1.5rem;
      color: #34495e;
      margin-bottom: 1rem;
    }

    .feature-card p {
      font-size: 1rem;
      color: #7f8c8d;
      margin-bottom: 1.5rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #3498db;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }

    .btn:hover {
      background-color: #2980b9;
    }
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding: 1rem 0;
      border-top: 1px solid #eaeaea;
      color: #7f8c8d;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}