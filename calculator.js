// Interactive Circular Economy & ROI Savings Calculator
import { sound } from './audio.js';

export class SustainabilityCalculator {
  constructor() {
    this.shipments = 2500;
    this.packagingType = 'cardboard'; // cardboard, wood, mixed
    this.damageRate = 0.024; // 2.4% with legacy packaging

    this.packageTypes = {
      cardboard: { name: 'Single-Use Corrugated Boxes', unitCost: 4.60, wastePerUnit: 1.15, co2PerUnit: 1.85, lifespan: 1 },
      wood: { name: 'Expendable Wooden Crates', unitCost: 36.00, wastePerUnit: 14.5, co2PerUnit: 8.20, lifespan: 12 },
      mixed: { name: 'Mixed Single-Use Drums / Plastic', unitCost: 18.00, wastePerUnit: 4.8, co2PerUnit: 5.10, lifespan: 4 }
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    const slider = document.getElementById('calc-shipments-slider');
    const display = document.getElementById('calc-shipments-value');
    
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.shipments = parseInt(e.target.value, 10);
        if (display) display.textContent = this.shipments.toLocaleString();
        this.calculate();
      });
    }

    document.querySelectorAll('.calc-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        document.querySelectorAll('.calc-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.packagingType = btn.dataset.type;
        this.calculate();
      });
    });
  }

  animateValue(element, target, prefix = '', suffix = '', decimals = 0) {
    if (!element) return;
    const start = parseFloat(element.dataset.currentVal || 0);
    const duration = 600;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const current = start + (target - start) * ease;

      element.textContent = `${prefix}${current.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.dataset.currentVal = target;
      }
    };

    requestAnimationFrame(update);
  }

  calculate() {
    const type = this.packageTypes[this.packagingType] || this.packageTypes.cardboard;
    const annualShipments = this.shipments * 12;

    // Waste avoided
    const annualWasteTonnes = (annualShipments * type.wastePerUnit) / 1000;
    
    // CO2 offset
    const annualCo2Tonnes = (annualShipments * type.co2PerUnit) / 1000;
    
    // Tree equivalence (approx 1 tree absorbs ~22kg CO2/year)
    const treesEquivalent = Math.round((annualCo2Tonnes * 1000) / 21.7);

    // Cost calculations
    const annualLegacySpend = annualShipments * type.unitCost;
    
    // Yogsang fleet size needed with 45-day turnaround cycle:
    const fleetRequired = Math.ceil(this.shipments * 1.5);
    const yogsangUnitCost = 149;
    const initialInvestment = fleetRequired * yogsangUnitCost;
    const annualMaintenance = fleetRequired * 8; // negligible cleaning/service
    
    const year1Savings = Math.max(0, annualLegacySpend - initialInvestment - annualMaintenance);
    const year3CumulativeSavings = (annualLegacySpend * 3) - initialInvestment - (annualMaintenance * 3);
    
    const monthlyLegacySpend = this.shipments * type.unitCost;
    const monthlyNetSavings = monthlyLegacySpend - (annualMaintenance / 12);
    const paybackMonths = Math.max(1.8, Math.min(18, (initialInvestment / (monthlyNetSavings || 1))));

    // Update DOM
    this.animateValue(document.getElementById('res-waste-tons'), annualWasteTonnes, '', ' Metric Tons', 1);
    this.animateValue(document.getElementById('res-co2-tons'), annualCo2Tonnes, '', ' T CO₂e', 1);
    this.animateValue(document.getElementById('res-trees-count'), treesEquivalent, '', ' Trees', 0);
    this.animateValue(document.getElementById('res-cost-savings'), year3CumulativeSavings, '$', '', 0);
    this.animateValue(document.getElementById('res-payback-months'), paybackMonths, '', ' Months', 1);
    this.animateValue(document.getElementById('res-units-eliminated'), annualShipments, '', ' Units/Yr', 0);
  }
}
