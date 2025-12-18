import { createChart } from 'lightweight-charts';

class CandlestickChartCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this.chart = null;
    this.candlestickSeries = null;
    this.ws = null;
    this.currentInterval = '1m';
    this.candleData = new Map();
  }

  setConfig(config) {
    if (!config.symbol) {
      throw new Error('Please define a symbol (e.g., BTCUSDT, ADAUSDT)');
    }

    this._config = {
      symbol: config.symbol.toLowerCase(),
      title: config.title || `${config.symbol.toUpperCase()} Chart`,
      intervals: config.intervals || ['1m', '5m', '15m', '1h', '1d'],
      default_interval: config.default_interval || '1m',
      exchange: config.exchange || 'binance',
      height: config.height || 500,
      show_header: config.show_header !== false,
      show_toolbar: config.show_toolbar !== false,
      show_volume: config.show_volume !== false, // Show volume by default
      chart_type: config.chart_type || 'candlestick',
      ...config
    };

    this.currentInterval = this._config.default_interval;
    this.render();
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;

    // Detect theme changes and update chart colors
    if (oldHass && this.chart) {
      const oldTheme = this.getThemeMode(oldHass);
      const newTheme = this.getThemeMode(hass);
      if (oldTheme !== newTheme) {
        this.updateChartTheme();
      }
    }
  }

  getCardSize() {
    // Dynamic card size based on height config
    const baseSize = 3;
    const heightFactor = Math.ceil((this._config.height || 500) / 100);
    return Math.max(baseSize, heightFactor);
  }

  getThemeMode(hass = this._hass) {
    if (!hass) return 'dark';

    // Check if HA is in dark mode
    const haTheme = hass.themes?.darkMode ?? hass.selectedTheme?.includes('dark') ?? false;

    // Also check CSS variable for theme
    if (this.shadowRoot) {
      const bgColor = getComputedStyle(this).getPropertyValue('--primary-background-color');
      if (bgColor) {
        // Convert rgb to brightness to detect dark mode
        const rgb = bgColor.match(/\d+/g);
        if (rgb) {
          const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
          return brightness < 128 ? 'dark' : 'light';
        }
      }
    }

    return haTheme ? 'dark' : 'light';
  }

  disconnectedCallback() {
    this.closeWebSocket();
    if (this.chart) {
      this.chart.remove();
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .card {
          background: var(--ha-card-background, var(--card-background-color, white));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2));
          padding: 16px;
          overflow: hidden;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .card-title {
          font-size: 1.5em;
          font-weight: 500;
          color: var(--primary-text-color);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #666;
          animation: pulse 2s ease-in-out infinite;
        }
        .status-indicator.connected {
          background: #00b746;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .interval-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .interval-btn {
          background: var(--secondary-background-color, #e0e0e0);
          color: var(--primary-text-color, #212121);
          border: 1px solid var(--divider-color, #e0e0e0);
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85em;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .interval-btn:hover {
          background: var(--primary-color, #03a9f4);
          color: var(--text-primary-color, white);
          transform: translateY(-1px);
        }
        .interval-btn.active {
          background: var(--primary-color, #03a9f4);
          border-color: var(--primary-color, #03a9f4);
          color: var(--text-primary-color, white);
          box-shadow: 0 2px 8px rgba(3, 169, 244, 0.4);
        }
        #chart-container {
          margin-top: 16px;
          border-radius: 8px;
          overflow: hidden;
          background: transparent;
          position: relative;
          height: ${this._config.height}px;
        }
        .info-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding: 8px 12px;
          background: var(--secondary-background-color, #f5f5f5);
          border-radius: 6px;
          font-size: 0.85em;
          color: var(--secondary-text-color);
        }
        .price-info {
          display: flex;
          gap: 16px;
        }
        .price-label {
          color: var(--secondary-text-color);
          margin-right: 4px;
        }
        .price-value {
          color: var(--primary-text-color);
          font-weight: 600;
        }
        .price-value.up {
          color: #00b746;
        }
        .price-value.down {
          color: #ef403c;
        }
      </style>
      <div class="card">
        ${this._config.show_header ? `
          <div class="card-header">
            <div class="card-title">
              <span class="status-indicator" id="status"></span>
              ${this._config.title}
            </div>
            ${this._config.show_toolbar ? `
              <div class="interval-buttons">
                ${this._config.intervals.map(interval => `
                  <button class="interval-btn ${interval === this.currentInterval ? 'active' : ''}"
                          data-interval="${interval}">
                    ${interval.toUpperCase()}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        ` : ''}
        <div id="chart-container"></div>
        ${this._config.show_header ? `
          <div class="info-bar">
          <div class="price-info">
            <div>
              <span class="price-label">O:</span>
              <span class="price-value" id="open">-</span>
            </div>
            <div>
              <span class="price-label">H:</span>
              <span class="price-value" id="high">-</span>
            </div>
            <div>
              <span class="price-label">L:</span>
              <span class="price-value" id="low">-</span>
            </div>
            <div>
              <span class="price-label">C:</span>
              <span class="price-value" id="close">-</span>
            </div>
          </div>
          <div id="exchange-info">${this._config.exchange.toUpperCase()}</div>
        </div>
        ` : ''}
      </div>
    `;

    this.setupEventListeners();

    // Wait for DOM to be ready before initializing chart
    requestAnimationFrame(() => {
      this.initChart();
      this.loadHistoricalData();
    });
  }

  setupEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.interval-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentInterval = e.target.dataset.interval;
        buttons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.reconnectWebSocket();
      });
    });
  }

  getChartColors() {
    const isDark = this.getThemeMode() === 'dark';

    return {
      layout: {
        background: { color: 'transparent' },
        textColor: isDark ? '#d1d4dc' : '#191919',
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(42, 46, 57, 0.6)' : 'rgba(197, 203, 206, 0.5)' },
        horzLines: { color: isDark ? 'rgba(42, 46, 57, 0.6)' : 'rgba(197, 203, 206, 0.5)' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: isDark ? 'rgba(197, 203, 206, 0.4)' : 'rgba(42, 46, 57, 0.4)',
      },
      timeScale: {
        borderColor: isDark ? 'rgba(197, 203, 206, 0.4)' : 'rgba(42, 46, 57, 0.4)',
        timeVisible: true,
        secondsVisible: false,
      },
      localization: {
        locale: navigator.language || 'cs-CZ',
        timeFormatter: (time) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString(navigator.language || 'cs-CZ', {
            hour: '2-digit',
            minute: '2-digit',
          });
        },
        dateFormatter: (time) => {
          const date = new Date(time * 1000);
          return date.toLocaleDateString(navigator.language || 'cs-CZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        },
      },
      candles: {
        upColor: '#26a69a',
        downColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      }
    };
  }

  initChart() {
    const container = this.shadowRoot.querySelector('#chart-container');
    if (!container) return;

    // Clear previous chart
    container.innerHTML = '';

    // Get container width, fallback to parent or minimum width
    const width = container.clientWidth || container.offsetWidth || 600;

    const colors = this.getChartColors();

    this.chart = createChart(container, {
      width: width,
      height: this._config.height,
      layout: colors.layout,
      grid: colors.grid,
      crosshair: colors.crosshair,
      rightPriceScale: colors.rightPriceScale,
      timeScale: colors.timeScale,
      localization: colors.localization,
    });

    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: colors.candles.upColor,
      downColor: colors.candles.downColor,
      borderVisible: false,
      wickUpColor: colors.candles.wickUpColor,
      wickDownColor: colors.candles.wickDownColor,
    });

    // Add volume series if enabled
    if (this._config.show_volume) {
      this.volumeSeries = this.chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // separate price scale for volume
      });

      this.volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8, // volume takes bottom 20% of chart
          bottom: 0,
        },
      });
    }

    // Handle resize
    const resizeObserver = new ResizeObserver(entries => {
      if (this.chart && entries.length > 0) {
        const { width } = entries[0].contentRect;
        this.chart.applyOptions({ width });
      }
    });
    resizeObserver.observe(container);

    // Crosshair move handler - show current candle when not hovering
    this.chart.subscribeCrosshairMove((param) => {
      if (!param.time) {
        // Mouse left chart area - show current candle
        if (this.currentCandle) {
          this.updatePriceInfo(this.currentCandle);
        }
        return;
      }

      const data = param.seriesData.get(this.candlestickSeries);
      if (data) {
        this.updatePriceInfo(data);
      }
    });
  }

  updateChartTheme() {
    if (!this.chart) return;

    const colors = this.getChartColors();

    // Update chart layout colors
    this.chart.applyOptions({
      layout: colors.layout,
      grid: colors.grid,
      rightPriceScale: colors.rightPriceScale,
      timeScale: colors.timeScale,
    });

    // Update candlestick colors
    if (this.candlestickSeries) {
      this.candlestickSeries.applyOptions({
        upColor: colors.candles.upColor,
        downColor: colors.candles.downColor,
        wickUpColor: colors.candles.wickUpColor,
        wickDownColor: colors.candles.wickDownColor,
      });
    }
  }

  formatPrice(price) {
    // Dynamic formatting based on price magnitude
    if (price >= 1000) {
      return price.toFixed(2);
    } else if (price >= 1) {
      return price.toFixed(4);
    } else if (price >= 0.0001) {
      return price.toFixed(6);
    } else {
      return price.toFixed(8);
    }
  }

  updatePriceInfo(data) {
    const openEl = this.shadowRoot.querySelector('#open');
    const highEl = this.shadowRoot.querySelector('#high');
    const lowEl = this.shadowRoot.querySelector('#low');
    const closeEl = this.shadowRoot.querySelector('#close');

    if (data && openEl && highEl && lowEl && closeEl) {
      openEl.textContent = this.formatPrice(data.open);
      highEl.textContent = this.formatPrice(data.high);
      lowEl.textContent = this.formatPrice(data.low);
      closeEl.textContent = this.formatPrice(data.close);

      // Color the close price
      closeEl.classList.remove('up', 'down');
      if (data.close > data.open) {
        closeEl.classList.add('up');
      } else if (data.close < data.open) {
        closeEl.classList.add('down');
      }
    }
  }

  async loadHistoricalData() {
    try {
      // Binance REST API for historical klines
      const limit = this.getHistoricalLimit();
      const url = `https://api.binance.com/api/v3/klines?symbol=${this._config.symbol.toUpperCase()}&interval=${this.currentInterval}&limit=${limit}`;

      const response = await fetch(url);
      const data = await response.json();

      const candleData = data.map(d => ({
        time: Math.floor(d[0] / 1000), // Convert to seconds
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));

      const volumeData = data.map(d => ({
        time: Math.floor(d[0] / 1000),
        value: parseFloat(d[5]), // volume
        color: parseFloat(d[4]) >= parseFloat(d[1]) ? '#26a69a80' : '#ef535080', // green if close >= open, else red
      }));

      if (this.candlestickSeries && candleData.length > 0) {
        this.candlestickSeries.setData(candleData);

        // Set volume data if enabled
        if (this.volumeSeries && volumeData.length > 0) {
          this.volumeSeries.setData(volumeData);
        }

        // Update price info with latest candle
        const latestCandle = candleData[candleData.length - 1];
        this.updatePriceInfo(latestCandle);

        // Store the latest candle for updates
        this.currentCandle = latestCandle;
      }

      // After loading historical data, connect to WebSocket
      this.connectWebSocket();
    } catch (error) {
      console.error('Error loading historical data:', error);
      this.setStatus(false);
    }
  }

  getHistoricalLimit() {
    const limitMap = {
      '1m': 500,
      '3m': 500,
      '5m': 500,
      '15m': 500,
      '30m': 500,
      '1h': 500,
      '2h': 500,
      '4h': 500,
      '6h': 300,
      '8h': 300,
      '12h': 300,
      '1d': 365,
      '3d': 300,
      '1w': 200,
    };
    return limitMap[this.currentInterval] || 500;
  }

  connectWebSocket() {
    this.closeWebSocket();

    const wsUrl = `wss://stream.binance.com:9443/ws/${this._config.symbol}@kline_${this.currentInterval}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.setStatus(true);
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const kline = data.k;

      const candle = {
        time: Math.floor(kline.t / 1000),
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
      };

      const volume = {
        time: Math.floor(kline.t / 1000),
        value: parseFloat(kline.v),
        color: parseFloat(kline.c) >= parseFloat(kline.o) ? '#26a69a80' : '#ef535080',
      };

      if (this.candlestickSeries) {
        this.candlestickSeries.update(candle);
        this.updatePriceInfo(candle);
        this.currentCandle = candle;
      }

      if (this.volumeSeries) {
        this.volumeSeries.update(volume);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.setStatus(false);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.setStatus(false);

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (this.isConnected) {
          this.connectWebSocket();
        }
      }, 5000);
    };
  }

  closeWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  reconnectWebSocket() {
    this.candleData.clear();
    this.loadHistoricalData();
  }

  setStatus(connected) {
    const statusEl = this.shadowRoot.querySelector('#status');
    if (statusEl) {
      if (connected) {
        statusEl.classList.add('connected');
      } else {
        statusEl.classList.remove('connected');
      }
    }
  }

  get isConnected() {
    return this.isConnected;
  }

  static getStubConfig() {
    return {
      symbol: 'BTCUSDT',
      title: 'Bitcoin / USDT',
      intervals: ['1m', '5m', '15m', '1h', '1d'],
      default_interval: '1m',
      exchange: 'binance',
      height: 500,
      show_header: true,
      show_toolbar: true,
      show_volume: true,
      chart_type: 'candlestick'
    };
  }
}

customElements.define('candlestick-chart-card', CandlestickChartCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'candlestick-chart-card',
  name: 'Candlestick Chart Card',
  description: 'Real-time cryptocurrency candlestick chart using TradingView Lightweight Charts',
  preview: true,
  documentationURL: 'https://github.com/yourusername/ha-candlestick-chart-card'
});

console.info(
  `%c CANDLESTICK-CHART-CARD %c v2.0.0 - Real-Time `,
  'color: white; background: #26a69a; font-weight: 700;',
  'color: white; background: #ef5350; font-weight: 700;'
);
