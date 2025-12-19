# 📊 Real-Time Candlestick Chart Card for Home Assistant

A custom Home Assistant Lovelace card that displays **real-time cryptocurrency candlestick charts** using TradingView's Lightweight Charts library and Binance WebSocket streams.

![Version](https://img.shields.io/badge/version-2.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📈 **Real-Time Updates** - Live candlestick data via WebSocket (updates every second)
- 🎨 **TradingView-Style Charts** - Professional financial charts using Lightweight Charts
- ⏱️ **Multiple Time Intervals** - 1m, 5m, 15m, 1h, 4h, 1d and more
- 🔴🟢 **Color-Coded Candles** - Green for rising, red for falling (like TradingView)
- 📊 **Volume Bars** - Trading volume histogram with color coding
- 💹 **OHLC Display** - Real-time Open, High, Low, Close values with smart formatting
- 🔌 **WebSocket Connection** - Live status indicator with auto-reconnect
- 🎯 **Binance Integration** - Direct connection to Binance crypto market data
- 🌓 **Auto Light/Dark Theme** - Detects and adapts to HA theme automatically
- 🌍 **Local Timezone** - Displays times in your browser's local timezone automatically
- 🎛️ **Customizable UI** - Hide/show header, toolbar, volume bars
- 📱 **Responsive** - Works on all screen sizes with dynamic card sizing

## 🎥 Preview

The card shows:
- Live candlestick chart with real-time updates
- Current OHLC (Open, High, Low, Close) prices
- WebSocket connection status indicator (green dot when connected)
- Time interval buttons for quick switching
- Interactive crosshair with price details

## 📦 Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Frontend"
3. Click the "+" button
4. Search for "Candlestick Chart Card"
5. Click "Install"
6. Restart Home Assistant

### Manual Installation

1. Download `candlestick-chart-card.js` from the [latest release](https://github.com/yourusername/ha-candlestick-chart-card/releases)
2. Copy the file to your Home Assistant's `config/www/` directory
3. Add the following to your Lovelace resources:

```yaml
resources:
  - url: /local/candlestick-chart-card.js
    type: module
```

4. Restart Home Assistant

## ⚙️ Configuration

### Basic Configuration

```yaml
type: custom:candlestick-chart-card
symbol: BTCUSDT
```

### Full Configuration Example

```yaml
type: custom:candlestick-chart-card
symbol: ADAUSDT
title: "Cardano / USDT"
intervals:
  - 1m
  - 5m
  - 15m
  - 1h
  - 4h
  - 1d
default_interval: 5m
exchange: binance
height: 500
```

### Configuration Options

| Option | Type | Default | Required | Description |
|--------|------|---------|----------|-------------|
| `symbol` | string | - | ✅ | Trading pair symbol (e.g., BTCUSDT, ADAUSDT, ETHUSDT) |
| `title` | string | `{SYMBOL} Chart` | ❌ | Card title |
| `intervals` | array | `['1m','5m','15m','1h','1d']` | ❌ | Available time intervals |
| `default_interval` | string | `'1m'` | ❌ | Default selected interval |
| `exchange` | string | `'binance'` | ❌ | Exchange name (displayed in info bar) |
| `height` | number | `500` | ❌ | Chart height in pixels |
| `show_header` | boolean | `true` | ❌ | Show/hide info bar with OHLC values |
| `show_title` | boolean | `true` | ❌ | Show/hide card title (works independently of show_header) |
| `show_toolbar` | boolean | `true` | ❌ | Show/hide interval selection toolbar |
| `show_volume` | boolean | `true` | ❌ | Show/hide volume bars below chart |
| `chart_type` | string | `'candlestick'` | ❌ | Chart type (future: line, area) |

### Supported Intervals

- `1m` - 1 minute
- `3m` - 3 minutes
- `5m` - 5 minutes
- `15m` - 15 minutes
- `30m` - 30 minutes
- `1h` - 1 hour
- `2h` - 2 hours
- `4h` - 4 hours
- `6h` - 6 hours
- `8h` - 8 hours
- `12h` - 12 hours
- `1d` - 1 day
- `3d` - 3 days
- `1w` - 1 week

### Supported Symbols (Binance)

You can use any trading pair available on Binance Spot market:

**Popular Cryptocurrencies:**
- `BTCUSDT` - Bitcoin
- `ETHUSDT` - Ethereum
- `ADAUSDT` - Cardano
- `BNBUSDT` - Binance Coin
- `SOLUSDT` - Solana
- `XRPUSDT` - Ripple
- `DOGEUSDT` - Dogecoin
- `DOTUSDT` - Polkadot
- `MATICUSDT` - Polygon

**And many more!** Check [Binance](https://www.binance.com/) for the full list.

## 📖 Examples

### Bitcoin Chart

```yaml
type: custom:candlestick-chart-card
symbol: BTCUSDT
title: "Bitcoin / USDT"
intervals:
  - 1m
  - 5m
  - 15m
  - 1h
  - 1d
default_interval: 5m
height: 600
```

### Cardano with Custom Intervals

```yaml
type: custom:candlestick-chart-card
symbol: ADAUSDT
title: "ADA Price Live"
intervals:
  - 1m
  - 15m
  - 1h
  - 4h
  - 1d
default_interval: 15m
```

### Ethereum Day Trading Setup

```yaml
type: custom:candlestick-chart-card
symbol: ETHUSDT
title: "ETH/USDT - Day Trading"
intervals:
  - 1m
  - 3m
  - 5m
  - 15m
  - 30m
default_interval: 5m
height: 550
```

### Minimalist Chart (No Header/Toolbar)

```yaml
type: custom:candlestick-chart-card
symbol: ADAUSDT
show_header: false
show_title: false
height: 400
```

### Chart with Title Only (No Info Bar)

```yaml
type: custom:candlestick-chart-card
symbol: ADAUSDT
title: "Cardano / USDT"
show_header: false
show_title: true
default_interval: 1h
height: 400
```

### Clean Chart (Header Only, No Toolbar)

```yaml
type: custom:candlestick-chart-card
symbol: BTCUSDT
title: "Bitcoin"
show_toolbar: false
default_interval: 1h
height: 450
```

### Multi-Card Dashboard

Create a crypto dashboard with multiple cards:

```yaml
type: vertical-stack
cards:
  - type: custom:candlestick-chart-card
    symbol: BTCUSDT
    title: "Bitcoin"
    default_interval: 1h
    height: 400

  - type: horizontal-stack
    cards:
      - type: custom:candlestick-chart-card
        symbol: ETHUSDT
        title: "Ethereum"
        default_interval: 1h
        height: 300

      - type: custom:candlestick-chart-card
        symbol: ADAUSDT
        title: "Cardano"
        default_interval: 1h
        height: 300
```

## 🌓 Theme Support

The card automatically detects and adapts to your Home Assistant theme:

### Automatic Theme Detection

- **Light Mode**: Darker text, lighter grid lines, bright backgrounds
- **Dark Mode**: Lighter text, darker grid lines, dark backgrounds
- **Auto-Update**: Switches instantly when you change HA theme

### How It Works

1. Detects HA theme from `hass.themes.darkMode`
2. Falls back to CSS color brightness analysis
3. Updates all chart colors dynamically
4. Uses HA CSS variables for perfect integration

### Theme Colors

The card uses these HA CSS variables:
- `--ha-card-background` - Card background
- `--primary-text-color` - Main text
- `--secondary-text-color` - Secondary text
- `--primary-color` - Accent color (buttons)
- `--secondary-background-color` - Info bar background
- `--divider-color` - Borders and separators

No configuration needed - it just works! ✨

## 🌍 Timezone & Localization

The card automatically displays times in your browser's local timezone:

### Automatic Timezone Conversion

- **UTC to Local**: Binance provides data in UTC, card converts to your local timezone
- **DST Aware**: Automatically handles daylight saving time changes
- **No Configuration**: Works automatically based on browser locale settings

### How It Works

1. Chart receives timestamps from Binance in UTC
2. Automatically converts to browser's local timezone
3. Formats dates and times using your browser's locale
4. Updates immediately if timezone changes

### Examples

If you're in Central European Time (CET/CEST):
- **UTC 20:00** → **CET 21:00** (winter) or **CEST 22:00** (summer)
- **Chart displays**: Times in your local timezone (e.g., 21:00, 22:00)
- **Date format**: Matches your locale (e.g., DD.MM.YYYY for Czech, MM/DD/YYYY for US)

### Browser Locale Detection

The card uses `navigator.language` to detect your browser's locale:
- **Czech users**: Dates formatted as `DD.MM.YYYY`, times as `HH:MM`
- **US users**: Dates formatted as `MM/DD/YYYY`, times as `h:MM AM/PM`
- **Other locales**: Automatically adapts to browser settings

No manual timezone configuration needed - the card automatically displays times correctly for your location! 🌍

## 🔧 How It Works

### Data Flow

1. **Historical Data**: On load, the card fetches historical candlestick data from Binance REST API
2. **Real-Time Updates**: Then connects to Binance WebSocket for live updates
3. **Candle Updates**: Each candle updates in real-time as new trades occur
4. **Interval Switching**: When you switch intervals, it reloads historical data and reconnects WebSocket

### WebSocket Connection

- Connects to: `wss://stream.binance.com:9443/ws/{symbol}@kline_{interval}`
- Updates: Every second (or more frequently based on market activity)
- Auto-Reconnect: Automatically reconnects if connection drops
- Status Indicator: Green dot shows active connection

### OHLC Data

The info bar displays:
- **O (Open)**: First price in the time period
- **H (High)**: Highest price in the time period
- **L (Low)**: Lowest price in the time period
- **C (Close)**: Current/last price in the time period

Colors:
- 🟢 **Green**: Close > Open (bullish/rising)
- 🔴 **Red**: Close < Open (bearish/falling)




## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 💖 Support

If you find this card useful:
- ⭐ Star the repository on GitHub
- 🐛 Report issues on the [issue tracker](https://github.com/yourusername/ha-candlestick-chart-card/issues)
- 💡 Suggest new features
- 📖 Improve documentation

## 🙏 Credits

- Built with [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/)
- Market data from [Binance](https://www.binance.com/)
- Inspired by professional trading platforms like TradingView

## ⚠️ Disclaimer

This card is for informational and educational purposes only. It displays real-time market data but should not be used as the sole basis for trading decisions. Always do your own research and consult with financial advisors before trading.

---

**Note:** This is a custom card and is not officially supported by Home Assistant or Binance.

Made with ❤️ for the Home Assistant community
