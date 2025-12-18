# 📊 Real-Time Candlestick Chart Card for Home Assistant

A custom Home Assistant Lovelace card that displays **real-time cryptocurrency candlestick charts** using TradingView's Lightweight Charts library and Binance WebSocket streams.

![Version](https://img.shields.io/badge/version-2.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📈 **Real-Time Updates** - Live candlestick data via WebSocket (updates every second)
- 🎨 **TradingView-Style Charts** - Professional financial charts using Lightweight Charts
- ⏱️ **Multiple Time Intervals** - 1m, 5m, 15m, 1h, 4h, 1d and more
- 🔴🟢 **Color-Coded Candles** - Green for rising, red for falling (like TradingView)
- 💹 **OHLC Display** - Real-time Open, High, Low, Close values
- 🔌 **WebSocket Connection** - Live status indicator
- 🎯 **Binance Integration** - Direct connection to Binance crypto market data
- 🌓 **Theme Support** - Automatically adapts to your Home Assistant theme
- 📱 **Responsive** - Works on all screen sizes

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

## 🛠️ Development

### Building from Source

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ha-candlestick-chart-card.git
cd ha-candlestick-chart-card
```

2. Install dependencies:
```bash
npm install
```

3. Build the card:
```bash
npm run build
```

The compiled file will be in `dist/candlestick-chart-card.js`

### Development Mode

Watch for changes and rebuild automatically:
```bash
npm run watch
```

## 📋 Requirements

- Home Assistant 2021.3.0 or newer
- Internet connection (for Binance API access)
- Modern browser with WebSocket support

## ❓ Troubleshooting

### Chart not loading

- Check browser console for errors
- Verify the symbol exists on Binance (e.g., `BTCUSDT`)
- Check your internet connection
- Try a different symbol

### WebSocket not connecting (red indicator)

- Check your firewall settings
- Verify you can access `wss://stream.binance.com:9443`
- Try refreshing the page
- Check browser console for WebSocket errors

### Chart looks wrong or styling issues

- Clear your browser cache
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Check Home Assistant theme compatibility
- Verify you're using a compatible Home Assistant version

### No data showing

- Verify the symbol is correct (must be uppercase for Binance)
- Check if the market is active
- Try a popular symbol like `BTCUSDT`
- Check browser network tab for API errors

## 🌟 Technical Details

### Built With

- [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/) - Fast, lightweight financial charts
- [Binance WebSocket API](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams) - Real-time market data
- [Binance REST API](https://developers.binance.com/docs/binance-spot-api-docs/rest-api) - Historical candlestick data

### Performance

- **Chart Library**: Only ~50KB gzipped
- **Updates**: Handles multiple updates per second smoothly
- **Memory**: Efficient memory usage with automatic cleanup
- **Responsive**: ResizeObserver for automatic chart resizing

### Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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
