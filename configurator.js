// Interactive Product Configurator for Yogsang Packaging Systems
import { sound } from './audio.js';

export class Configurator {
  constructor() {
    this.state = {
      size: '160L',
      color: 'obsidian',
      addons: new Set(['iot', 'laser']),
      quantity: 100
    };

    this.sizes = {
      '60L': { name: 'Compact Carrier', capacity: '60 Liters', dims: '600 × 400 × 320 mm', tare: 4.8, load: 450, basePrice: 89 },
      '160L': { name: 'Standard Logistics Core', capacity: '160 Liters', dims: '800 × 600 × 450 mm', tare: 9.4, load: 1200, basePrice: 149 },
      '350L': { name: 'Heavy Cargo Monolith', capacity: '350 Liters', dims: '1000 × 800 × 650 mm', tare: 18.2, load: 2500, basePrice: 279 },
      '800L': { name: 'Mega Pallet Unit', capacity: '800 Liters', dims: '1200 × 1000 × 900 mm', tare: 34.5, load: 4000, basePrice: 520 }
    };

    this.colors = {
      'obsidian': { name: 'Obsidian Matte Carbon', hex: '#16181f', border: '#2a2e3d', glow: '#00e599' },
      'titanium': { name: 'Cyber Titanium Gray', hex: '#374151', border: '#4b5563', glow: '#38bdf8' },
      'emerald': { name: 'Bio-Emerald Circular', hex: '#064e3b', border: '#047857', glow: '#34d399' },
      'amber': { name: 'Hazard Safety Amber', hex: '#78350f', border: '#d97706', glow: '#fbbf24' }
    };

    this.addonsList = {
      'iot': { name: 'IoT Real-Time Telemetry & Shock Sensor', price: 45 },
      'thermal': { name: 'Cryo-Shield Thermal Insulation', price: 38 },
      'laser': { name: 'Custom Laser Engraving & Asset QR Tag', price: 12 },
      'esd': { name: 'ESD Electrostatic Dissipative Coating', price: 24 }
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.updatePreview();
  }

  bindEvents() {
    // Size selectors
    document.querySelectorAll('.config-size-card').forEach(card => {
      card.addEventListener('click', () => {
        sound.playClick();
        document.querySelectorAll('.config-size-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.state.size = card.dataset.size;
        this.updatePreview();
      });
    });

    // Color swatches
    document.querySelectorAll('.config-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        sound.playClick();
        document.querySelectorAll('.config-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.state.color = swatch.dataset.color;
        this.updatePreview();
      });
    });

    // Add-on checkboxes
    document.querySelectorAll('.config-addon-item').forEach(item => {
      item.addEventListener('click', () => {
        sound.playHover();
        const id = item.dataset.addon;
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          if (checkbox.checked) {
            this.state.addons.add(id);
            item.classList.add('active');
          } else {
            this.state.addons.delete(id);
            item.classList.remove('active');
          }
          this.updatePreview();
        }
      });
    });

    // Quantity slider
    const qtySlider = document.getElementById('config-qty-slider');
    const qtyDisplay = document.getElementById('config-qty-display');
    if (qtySlider) {
      qtySlider.addEventListener('input', (e) => {
        this.state.quantity = parseInt(e.target.value, 10);
        if (qtyDisplay) qtyDisplay.textContent = this.state.quantity.toLocaleString();
        this.updatePreview();
      });
    }

    // Export / Quote CTA
    const quoteBtn = document.getElementById('btn-request-configured-quote');
    if (quoteBtn) {
      quoteBtn.addEventListener('click', () => {
        sound.playClick();
        this.openQuoteModal();
      });
    }
  }

  updatePreview() {
    const sizeData = this.sizes[this.state.size];
    const colorData = this.colors[this.state.color];

    // Compute pricing
    let unitAddonTotal = 0;
    this.state.addons.forEach(id => {
      if (this.addonsList[id]) {
        unitAddonTotal += this.addonsList[id].price;
      }
    });

    const baseUnit = sizeData.basePrice + unitAddonTotal;
    
    // Volume discounts
    let discount = 0;
    if (this.state.quantity >= 500) discount = 0.25;
    else if (this.state.quantity >= 200) discount = 0.18;
    else if (this.state.quantity >= 50) discount = 0.10;

    const unitFinal = Math.round(baseUnit * (1 - discount));
    const totalPrice = unitFinal * this.state.quantity;

    // DOM Updates
    const elName = document.getElementById('config-spec-name');
    const elDims = document.getElementById('config-spec-dims');
    const elTare = document.getElementById('config-spec-tare');
    const elLoad = document.getElementById('config-spec-load');
    const elUnit = document.getElementById('config-price-unit');
    const elTotal = document.getElementById('config-price-total');
    const elDiscount = document.getElementById('config-discount-badge');
    const elColorName = document.getElementById('config-color-name');

    if (elName) elName.textContent = sizeData.name;
    if (elDims) elDims.textContent = sizeData.dims;
    if (elTare) elTare.textContent = `${sizeData.tare} kg`;
    if (elLoad) elLoad.textContent = `${sizeData.load.toLocaleString()} kg`;
    if (elUnit) elUnit.textContent = `$${unitFinal}`;
    if (elTotal) elTotal.textContent = `$${totalPrice.toLocaleString()}`;
    if (elColorName) elColorName.textContent = colorData.name;

    if (elDiscount) {
      if (discount > 0) {
        elDiscount.textContent = `${Math.round(discount * 100)}% Volume Discount`;
        elDiscount.style.display = 'inline-flex';
      } else {
        elDiscount.style.display = 'none';
      }
    }

    // Visual Box Rendering
    this.update3DBoxVisual(sizeData, colorData);
  }

  update3DBoxVisual(sizeData, colorData) {
    const boxContainer = document.getElementById('configurator-visual-box');
    if (!boxContainer) return;

    // Dynamic style & glow application
    boxContainer.style.setProperty('--crate-color', colorData.hex);
    boxContainer.style.setProperty('--crate-border', colorData.border);
    boxContainer.style.setProperty('--crate-glow', colorData.glow);

    const hasIoT = this.state.addons.has('iot');
    const hasLaser = this.state.addons.has('laser');
    const hasThermal = this.state.addons.has('thermal');

    const iotIndicator = document.getElementById('crate-iot-indicator');
    const laserLogo = document.getElementById('crate-laser-logo');
    const cryoBadge = document.getElementById('crate-cryo-badge');

    if (iotIndicator) iotIndicator.style.opacity = hasIoT ? '1' : '0.1';
    if (laserLogo) laserLogo.style.opacity = hasLaser ? '1' : '0.2';
    if (cryoBadge) cryoBadge.style.opacity = hasThermal ? '1' : '0';
  }

  openQuoteModal() {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;
    
    // Fill pre-populated summary
    const summaryInput = document.getElementById('quote-summary-field');
    if (summaryInput) {
      const addons = Array.from(this.state.addons).map(id => this.addonsList[id]?.name).filter(Boolean).join(', ');
      summaryInput.value = `Model: ${this.state.size} (${this.sizes[this.state.size].name}) | Color: ${this.colors[this.state.color].name} | Qty: ${this.state.quantity} units | Options: ${addons || 'Standard'}`;
    }
    
    modal.classList.add('open');
  }
}
