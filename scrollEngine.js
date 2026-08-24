// Ultra-Smooth 60FPS Pure Canvas Scroll Engine - Cropped to "LET'S BUILD A BETTER FUTURE. TOGETHER."
export class ScrollEngine {
  constructor(options = {}) {
    this.canvas = document.getElementById(options.canvasId || 'hero-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: false }) : null;
    this.track = document.getElementById(options.trackId || 'scroll-track');
    this.frameDisplay = document.getElementById('frame-counter');
    this.progressFill = document.getElementById('scroll-progress-fill');
    this.loadingScreen = document.getElementById('loading-screen');
    this.loadingPercent = document.getElementById('loading-percentage');
    this.loadingBar = document.getElementById('loading-bar-fill');
    
    this.frameCount = options.frameCount || 240;
    this.images = [];
    this.loadedImages = 0;
    this.isLoaded = false;
    
    this.targetFrame = 0;
    this.currentFrame = 0;
    this.lastDrawnFrame = -1;

    // Crop ratio to keep image down to "LET'S BUILD A BETTER FUTURE. TOGETHER." and cut off explore button & watermark
    this.cropHeightRatio = 0.832;

    this.bindEvents();
    this.init();
  }

  getFramePath(index) {
    const pad = String(index + 1).padStart(3, '0');
    return `frames/ezgif-frame-${pad}.jpg`;
  }

  async init() {
    this.handleResize();
    await this.preloadFrames();
    this.startRenderLoop();
  }

  preloadFrames() {
    return new Promise((resolve) => {
      let criticalLoaded = false;
      const criticalThreshold = 10;

      for (let i = 0; i < this.frameCount; i++) {
        const img = new Image();
        img.src = this.getFramePath(i);
        
        img.onload = () => {
          this.loadedImages++;
          const percent = Math.floor((this.loadedImages / this.frameCount) * 100);
          
          if (this.loadingPercent) this.loadingPercent.textContent = `${percent}%`;
          if (this.loadingBar) this.loadingBar.style.width = `${percent}%`;

          if (i === 0 && !this.isLoaded) {
            this.drawFrame(0);
          }

          if (this.loadedImages >= criticalThreshold && !criticalLoaded) {
            criticalLoaded = true;
            this.hideLoader();
          }

          if (this.loadedImages === this.frameCount) {
            this.isLoaded = true;
            this.hideLoader();
            resolve();
          }
        };

        img.onerror = () => {
          this.loadedImages++;
          if (this.loadedImages === this.frameCount) {
            this.isLoaded = true;
            this.hideLoader();
            resolve();
          }
        };

        this.images.push(img);
      }
    });
  }

  hideLoader() {
    if (this.loadingScreen && !this.loadingScreen.classList.contains('hidden')) {
      this.loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        this.loadingScreen.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 500);
    }
  }

  handleResize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }

    if (this.images[Math.floor(this.currentFrame)]?.complete) {
      this.lastDrawnFrame = -1;
      this.drawFrame(Math.floor(this.currentFrame));
    }
  }

  drawFrame(frameIndex) {
    if (!this.ctx || !this.canvas) return;
    const index = Math.min(this.frameCount - 1, Math.max(0, Math.floor(frameIndex)));
    
    // Find closest loaded image
    let img = this.images[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 20; offset++) {
        const prev = this.images[Math.max(0, index - offset)];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = this.images[Math.min(this.frameCount - 1, index + offset)];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    // Crop source height to stop right below "LET'S BUILD A BETTER FUTURE. TOGETHER."
    const sWidth = imgW;
    const sHeight = Math.floor(imgH * this.cropHeightRatio);
    const sRatio = sWidth / sHeight;

    const canvasRatio = canvasW / canvasH;

    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > sRatio) {
      // Screen is wider than cropped frame -> Fit height
      renderH = canvasH;
      renderW = canvasH * sRatio;
      offsetX = (canvasW - renderW) / 2;
      offsetY = 0;
    } else {
      // Screen is narrower/taller than cropped frame -> Fit width and vertically center
      renderW = canvasW;
      renderH = canvasW / sRatio;
      offsetX = 0;
      offsetY = (canvasH - renderH) / 2;

      if (renderH > canvasH) {
        renderH = canvasH;
        renderW = canvasH * sRatio;
        offsetX = (canvasW - renderW) / 2;
        offsetY = 0;
      }
    }

    // Clear studio canvas
    this.ctx.fillStyle = '#07080b';
    this.ctx.fillRect(0, 0, canvasW, canvasH);
    
    // Draw cropped region (sx=0, sy=0, sWidth, sHeight)
    this.ctx.drawImage(img, 0, 0, sWidth, sHeight, offsetX, offsetY, renderW, renderH);

    this.lastDrawnFrame = index;

    // Update HUD frame counter & top progress
    if (this.frameDisplay) {
      this.frameDisplay.textContent = `${String(index + 1).padStart(3, '0')} / ${String(this.frameCount).padStart(3, '0')}`;
    }
    if (this.progressFill) {
      const pct = (index / (this.frameCount - 1)) * 100;
      this.progressFill.style.width = `${pct}%`;
    }
  }

  updateScroll() {
    if (!this.track) return;
    const rect = this.track.getBoundingClientRect();
    const trackHeight = this.track.offsetHeight - window.innerHeight;
    
    if (trackHeight <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.min(1, Math.max(0, scrolled / trackHeight));
    this.targetFrame = progress * (this.frameCount - 1);
  }

  startRenderLoop() {
    const render = () => {
      const diff = this.targetFrame - this.currentFrame;
      if (Math.abs(diff) > 0.01) {
        this.currentFrame += diff * 0.15;
        if (Math.abs(this.currentFrame - this.targetFrame) < 0.02) {
          this.currentFrame = this.targetFrame;
        }
      }

      const drawIndex = Math.round(this.currentFrame);
      if (drawIndex !== this.lastDrawnFrame) {
        this.drawFrame(drawIndex);
      }

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.handleResize(), { passive: true });
    window.addEventListener('scroll', () => this.updateScroll(), { passive: true });
    
    window.addEventListener('keydown', (e) => {
      if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) return;

      if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min(this.frameCount - 1, this.targetFrame + 3);
        const trackHeight = this.track.offsetHeight - window.innerHeight;
        window.scrollTo({ top: (next / (this.frameCount - 1)) * trackHeight, behavior: 'instant' });
      } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        e.preventDefault();
        const prev = Math.max(0, this.targetFrame - 3);
        const trackHeight = this.track.offsetHeight - window.innerHeight;
        window.scrollTo({ top: (prev / (this.frameCount - 1)) * trackHeight, behavior: 'instant' });
      }
    });
  }
}
