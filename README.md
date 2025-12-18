# Candlestick Chart Card for Home Assistant

A custom Home Assistant Lovelace card that displays sensor data as interactive candlestick charts with multiple time intervals.

![Candlestick Chart Card](https://img.shields.io/badge/version-1.0.0-blue)

## Features

- 📊 **Beautiful Candlestick Charts** - Display your sensor data in professional trading-style candlestick charts
- ⏱️ **Multiple Time Intervals** - Switch between 10 minutes, 30 minutes, 1 hour, and 1 day views
- 🎨 **Color Coded** - Green candles for rising values, red for falling values
- 🔍 **Interactive** - Zoom, pan, and explore your data with built-in chart tools
- 🎯 **Easy Configuration** - Simple YAML configuration
- 🌓 **Theme Support** - Automatically adapts to your Home Assistant theme

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Frontend"
3. Click the "+" button
4. Search for "Candlestick Chart Card"
5. Click "Install"

### Manual Installation

1. Download the `candlestick-chart-card.js` file from the [latest release](https://github.com/yourusername/ha-candlestick-chart-card/releases)
2. Copy the file to your Home Assistant's `config/www/` directory
3. Add the following to your `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/candlestick-chart-card.js
      type: module
```

4. Restart Home Assistant

## Configuration

### Basic Configuration

```yaml
type: custom:candlestick-chart-card
entity: sensor.your_sensor
title: "My Candlestick Chart"
```

### Full Configuration

```yaml
type: custom:candlestick-chart-card
entity: sensor.your_sensor
title: "My Candlestick Chart"
intervals:
  - 10m
  - 30m
  - 1h
  - 1d
default_interval: 1h
hours_to_show: 24
height: 400
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **Required** | Entity ID of the sensor to display |
| `title` | string | `"Candlestick Chart"` | Card title |
| `intervals` | array | `['10m', '30m', '1h', '1d']` | Available time intervals |
| `default_interval` | string | `'1h'` | Default selected interval |
| `hours_to_show` | number | `24` | Number of hours of historical data to fetch |
| `height` | number | `400` | Chart height in pixels |

### Time Intervals

- `10m` - 10 minutes per candle (shows last 2 hours)
- `30m` - 30 minutes per candle (shows last 6 hours)
- `1h` - 1 hour per candle (shows last 24 hours)
- `1d` - 1 day per candle (shows last 30 days)

## Examples

### Stock Price Sensor

```yaml
type: custom:candlestick-chart-card
entity: sensor.stock_price
title: "Stock Performance"
intervals:
  - 30m
  - 1h
  - 1d
default_interval: 1h
height: 500
```

### Temperature Sensor

```yaml
type: custom:candlestick-chart-card
entity: sensor.outside_temperature
title: "Temperature Trends"
intervals:
  - 1h
  - 1d
default_interval: 1d
```

### Energy Monitor

```yaml
type: custom:candlestick-chart-card
entity: sensor.power_consumption
title: "Power Usage"
intervals:
  - 10m
  - 30m
  - 1h
default_interval: 30m
height: 450
```

## How It Works

The card fetches historical data from your Home Assistant recorder and processes it into candlestick format:

- **Open**: First value in the time interval
- **High**: Highest value in the time interval
- **Low**: Lowest value in the time interval
- **Close**: Last value in the time interval

Candles are colored:
- 🟢 **Green**: Close value is higher than open (rising)
- 🔴 **Red**: Close value is lower than open (falling)

## Development

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

## Requirements

- Home Assistant 2021.3.0 or newer
- Recorder integration enabled
- Historical data for the sensor you want to display

## Troubleshooting

### Chart is empty

- Ensure the recorder integration is enabled
- Check that your sensor has historical data
- Verify the entity ID is correct
- Check browser console for errors

### Chart not updating

- Verify the sensor is still updating with new values
- Check the `hours_to_show` configuration
- Try refreshing the page

### Styling issues

- Clear your browser cache
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Check that you're using a compatible Home Assistant version

## Credits

Built with:
- [ApexCharts](https://apexcharts.com/) - Modern charting library
- [Lit](https://lit.dev/) - Web components library

## License

MIT License - See [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you find this card useful, please give it a ⭐ on GitHub!

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/yourusername/ha-candlestick-chart-card/issues).

---

**Note:** This is a custom card and is not officially supported by Home Assistant.
