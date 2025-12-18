import ApexCharts from 'apexcharts';

class CandlestickChartCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this.chart = null;
    this.currentInterval = '1h';
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
    this._config = {
      entity: config.entity,
      title: config.title || 'Candlestick Chart',
      intervals: config.intervals || ['10m', '30m', '1h', '1d'],
      default_interval: config.default_interval || '1h',
      hours_to_show: config.hours_to_show || 24,
      update_interval: config.update_interval || 60,
      height: config.height || 400,
      ...config
    };
    this.currentInterval = this._config.default_interval;
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.updateChart();
  }

  getCardSize() {
    return 4;
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
        }
        .card {
          background: var(--ha-card-background, var(--card-background-color, white));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
          padding: 16px;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .card-title {
          font-size: 1.5em;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .interval-buttons {
          display: flex;
          gap: 8px;
        }
        .interval-btn {
          background: var(--primary-color);
          color: var(--text-primary-color, white);
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9em;
          transition: all 0.3s ease;
        }
        .interval-btn:hover {
          opacity: 0.8;
        }
        .interval-btn.active {
          background: var(--accent-color, #03a9f4);
          box-shadow: 0 2px 8px rgba(3, 169, 244, 0.4);
        }
        #chart-container {
          margin-top: 16px;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: var(--secondary-text-color);
        }
      </style>
      <div class="card">
        <div class="card-header">
          <div class="card-title">${this._config.title}</div>
          <div class="interval-buttons">
            ${this._config.intervals.map(interval => `
              <button class="interval-btn ${interval === this.currentInterval ? 'active' : ''}"
                      data-interval="${interval}">
                ${interval}
              </button>
            `).join('')}
          </div>
        </div>
        <div id="chart-container"></div>
      </div>
    `;

    this.setupEventListeners();
    this.initChart();
  }

  setupEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.interval-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentInterval = e.target.dataset.interval;
        buttons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.updateChart();
      });
    });
  }

  initChart() {
    const container = this.shadowRoot.querySelector('#chart-container');
    if (!container) return;

    const options = {
      series: [{
        name: 'candle',
        data: []
      }],
      chart: {
        type: 'candlestick',
        height: this._config.height,
        background: 'transparent',
        animations: {
          enabled: true,
          speed: 800
        },
        toolbar: {
          show: true,
          tools: {
            download: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      title: {
        text: '',
        align: 'left',
        style: {
          color: 'var(--primary-text-color)'
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#00b746',
            downward: '#ef403c'
          },
          wick: {
            useFillColor: true
          }
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: 'var(--primary-text-color)'
          }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        },
        labels: {
          style: {
            colors: 'var(--primary-text-color)'
          },
          formatter: (value) => {
            return value ? value.toFixed(2) : '';
          }
        }
      },
      grid: {
        borderColor: 'var(--divider-color, #e0e0e0)',
        opacity: 0.3
      },
      tooltip: {
        theme: 'dark'
      }
    };

    this.chart = new ApexCharts(container, options);
    this.chart.render();
  }

  async updateChart() {
    if (!this._hass || !this.chart) return;

    try {
      const historyData = await this.fetchHistoryData();
      const candleData = this.processCandleData(historyData);

      this.chart.updateSeries([{
        name: 'candle',
        data: candleData
      }]);
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }

  async fetchHistoryData() {
    if (!this._hass) return [];

    const endTime = new Date();
    const startTime = new Date();

    // Calculate start time based on interval
    const intervalMap = {
      '10m': 2,
      '30m': 6,
      '1h': 24,
      '1d': 30 * 24
    };

    const hoursToFetch = intervalMap[this.currentInterval] || 24;
    startTime.setHours(startTime.getHours() - hoursToFetch);

    try {
      const response = await this._hass.callApi('GET',
        `history/period/${startTime.toISOString()}?filter_entity_id=${this._config.entity}&end_time=${endTime.toISOString()}`
      );

      return response[0] || [];
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }

  processCandleData(historyData) {
    if (!historyData || historyData.length === 0) {
      return [];
    }

    // Group data by interval
    const intervalMinutes = {
      '10m': 10,
      '30m': 30,
      '1h': 60,
      '1d': 1440
    };

    const minutes = intervalMinutes[this.currentInterval] || 60;
    const intervalMs = minutes * 60 * 1000;

    const groupedData = {};

    historyData.forEach(point => {
      const timestamp = new Date(point.last_changed).getTime();
      const intervalKey = Math.floor(timestamp / intervalMs) * intervalMs;
      const value = parseFloat(point.state);

      if (isNaN(value)) return;

      if (!groupedData[intervalKey]) {
        groupedData[intervalKey] = {
          x: intervalKey,
          y: [value, value, value, value] // [open, high, low, close]
        };
      } else {
        const candle = groupedData[intervalKey];
        candle.y[1] = Math.max(candle.y[1], value); // high
        candle.y[2] = Math.min(candle.y[2], value); // low
        candle.y[3] = value; // close (last value in interval)
      }
    });

    // Convert to array and sort by time
    return Object.values(groupedData).sort((a, b) => a.x - b.x);
  }

  static getStubConfig() {
    return {
      entity: 'sensor.example',
      title: 'Candlestick Chart',
      intervals: ['10m', '30m', '1h', '1d'],
      default_interval: '1h'
    };
  }
}

customElements.define('candlestick-chart-card', CandlestickChartCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'candlestick-chart-card',
  name: 'Candlestick Chart Card',
  description: 'Display sensor data as a candlestick chart with multiple time intervals',
  preview: true,
  documentationURL: 'https://github.com/yourusername/ha-candlestick-chart-card'
});

console.info(
  `%c CANDLESTICK-CHART-CARD %c v1.0.0 `,
  'color: white; background: #00b746; font-weight: 700;',
  'color: white; background: #ef403c; font-weight: 700;'
);
