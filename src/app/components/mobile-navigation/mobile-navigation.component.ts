import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// MatFabModule no existe, usamos MatButtonModule que incluye FAB

@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ] as any[],
  template: `
    <div class="mobile-nav" *ngIf="isMobile">
      <!-- Botón de filtros flotante -->
      <button mat-fab 
              class="fab-filters" 
              (click)="toggleFilters.emit()"
              [class.active]="filtersOpen"
              [attr.aria-label]="filtersOpen ? 'Cerrar filtros' : 'Abrir filtros'">
        <mat-icon>{{ filtersOpen ? 'close' : 'filter_list' }}</mat-icon>
      </button>
      
      <!-- Botón de ubicación -->
      <button mat-fab 
              class="fab-location" 
              (click)="getCurrentLocation.emit()"
              aria-label="Obtener ubicación actual">
        <mat-icon>my_location</mat-icon>
      </button>
      
      <!-- Botón de vista -->
      <button mat-fab 
              class="fab-view" 
              (click)="toggleView.emit()"
              [attr.aria-label]="viewMode === 'list' ? 'Ver en mapa' : 'Ver en lista'">
        <mat-icon>{{ viewMode === 'list' ? 'map' : 'list' }}</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .mobile-nav {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .fab-filters {
      background: #673ab7;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3);
      
      &.active {
        background: #5e35b1;
        transform: rotate(45deg);
        box-shadow: 0 6px 16px rgba(94, 53, 177, 0.4);
      }
      
      &:hover {
        background: #5e35b1;
        transform: scale(1.05);
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
    
    .fab-location {
      background: #2196f3;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
      
      &:hover {
        background: #1976d2;
        transform: scale(1.05);
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
    
    .fab-view {
      background: #4caf50;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      
      &:hover {
        background: #388e3c;
        transform: scale(1.05);
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
    
    @media (max-width: 480px) {
      .mobile-nav {
        bottom: 16px;
        right: 16px;
        gap: 8px;
      }
    }
    
    // Mejorar accesibilidad
    @media (prefers-reduced-motion: reduce) {
      .fab-filters, .fab-location, .fab-view {
        transition: none;
        
        &:hover, &:active {
          transform: none;
        }
      }
    }
  `]
})
export class MobileNavigationComponent {
  @Input() isMobile = false;
  @Input() filtersOpen = false;
  @Input() viewMode: 'list' | 'grid' | 'map' = 'list';
  
  @Output() toggleFilters = new EventEmitter<void>();
  @Output() getCurrentLocation = new EventEmitter<void>();
  @Output() toggleView = new EventEmitter<void>();
}
