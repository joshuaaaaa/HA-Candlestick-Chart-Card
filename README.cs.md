# 📊 Real-Time Candlestick Chart Card pro Home Assistant

Vlastní karta pro Home Assistant Lovelace, která zobrazuje **živé cryptocurrency svíčkové grafy** pomocí TradingView Lightweight Charts knihovny a Binance WebSocket streamů.

![Version](https://img.shields.io/badge/verze-2.0.0-blue) ![License](https://img.shields.io/badge/licence-MIT-green)

## ✨ Funkce

- 📈 **Živé Aktualizace** - Live candlestick data přes WebSocket (aktualizace každou sekundu)
- 🎨 **TradingView Styl** - Profesionální finanční grafy pomocí Lightweight Charts
- ⏱️ **Více Časových Intervalů** - 1m, 5m, 15m, 1h, 4h, 1d a více
- 🔴🟢 **Barevné Svíčky** - Zelené pro růst, červené pro pokles (jako TradingView)
- 💹 **OHLC Zobrazení** - Real-time Open, High, Low, Close hodnoty
- 🔌 **WebSocket Připojení** - Indikátor živého spojení s auto-reconnect
- 🎯 **Binance Integrace** - Přímé připojení k Binance krypto tržním datům
- 🌓 **Auto Světlý/Tmavý Motiv** - Detekuje a přizpůsobuje se HA motivu automaticky
- 🎛️ **Přizpůsobitelné UI** - Skrýt/zobrazit hlavičku, toolbar a více
- 📱 **Responzivní** - Funguje na všech velikostech s dynamickou velikostí karty

## 🎥 Náhled

Karta zobrazuje:
- Živý svíčkový graf s real-time aktualizacemi
- Aktuální OHLC (Open, High, Low, Close) ceny
- Indikátor WebSocket připojení (zelená tečka když připojeno)
- Tlačítka časových intervalů pro rychlé přepínání
- Interaktivní kurzor s detaily cen

## 📦 Instalace

### HACS (Doporučeno)

1. Otevřete HACS ve vaší instanci Home Assistant
2. Klikněte na "Frontend"
3. Klikněte na tlačítko "+"
4. Vyhledejte "Candlestick Chart Card"
5. Klikněte na "Instalovat"
6. Restartujte Home Assistant

### Manuální Instalace

1. Stáhněte `candlestick-chart-card.js` z [nejnovějšího vydání](https://github.com/yourusername/ha-candlestick-chart-card/releases)
2. Zkopírujte soubor do adresáře `config/www/` vašeho Home Assistanta
3. Přidejte následující do vašich Lovelace resources:

```yaml
resources:
  - url: /local/candlestick-chart-card.js
    type: module
```

4. Restartujte Home Assistant

## ⚙️ Konfigurace

### Základní Konfigurace

```yaml
type: custom:candlestick-chart-card
symbol: BTCUSDT
```

### Plný Příklad Konfigurace

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

### Možnosti Konfigurace

| Možnost | Typ | Výchozí | Povinné | Popis |
|---------|-----|---------|---------|-------|
| `symbol` | string | - | ✅ | Symbol obchodního páru (např. BTCUSDT, ADAUSDT, ETHUSDT) |
| `title` | string | `{SYMBOL} Chart` | ❌ | Název karty |
| `intervals` | pole | `['1m','5m','15m','1h','1d']` | ❌ | Dostupné časové intervaly |
| `default_interval` | string | `'1m'` | ❌ | Výchozí vybraný interval |
| `exchange` | string | `'binance'` | ❌ | Název burzy (zobrazeno v info baru) |
| `height` | number | `500` | ❌ | Výška grafu v pixelech |
| `show_header` | boolean | `true` | ❌ | Zobrazit/skrýt hlavičku s názvem a tlačítky |
| `show_toolbar` | boolean | `true` | ❌ | Zobrazit/skrýt toolbar s výběrem intervalů |
| `show_volume` | boolean | `false` | ❌ | Zobrazit/skrýt objemy (budoucí funkce) |
| `chart_type` | string | `'candlestick'` | ❌ | Typ grafu (budoucí: line, area) |

### Podporované Intervaly

- `1m` - 1 minuta
- `3m` - 3 minuty
- `5m` - 5 minut
- `15m` - 15 minut
- `30m` - 30 minut
- `1h` - 1 hodina
- `2h` - 2 hodiny
- `4h` - 4 hodiny
- `6h` - 6 hodin
- `8h` - 8 hodin
- `12h` - 12 hodin
- `1d` - 1 den
- `3d` - 3 dny
- `1w` - 1 týden

### Podporované Symboly (Binance)

Můžete použít jakýkoliv obchodní pár dostupný na Binance Spot trhu:

**Populární Kryptoměny:**
- `BTCUSDT` - Bitcoin
- `ETHUSDT` - Ethereum
- `ADAUSDT` - Cardano
- `BNBUSDT` - Binance Coin
- `SOLUSDT` - Solana
- `XRPUSDT` - Ripple
- `DOGEUSDT` - Dogecoin
- `DOTUSDT` - Polkadot
- `MATICUSDT` - Polygon

**A mnoho dalších!** Podívejte se na [Binance](https://www.binance.com/) pro úplný seznam.

## 📖 Příklady

### Bitcoin Graf

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

### Cardano s Vlastními Intervaly

```yaml
type: custom:candlestick-chart-card
symbol: ADAUSDT
title: "ADA Cena Live"
intervals:
  - 1m
  - 15m
  - 1h
  - 4h
  - 1d
default_interval: 15m
```

### Ethereum Denní Trading

```yaml
type: custom:candlestick-chart-card
symbol: ETHUSDT
title: "ETH/USDT - Denní Trading"
intervals:
  - 1m
  - 3m
  - 5m
  - 15m
  - 30m
default_interval: 5m
height: 550
```

### Více-Kartový Dashboard

Vytvořte krypto dashboard s více kartami:

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

## 🔧 Jak to Funguje

### Tok Dat

1. **Historická Data**: Při načtení karta stáhne historická candlestick data z Binance REST API
2. **Real-Time Aktualizace**: Poté se připojí k Binance WebSocket pro živé aktualizace
3. **Aktualizace Svíček**: Každá svíčka se aktualizuje v reálném čase při nových obchodech
4. **Přepínání Intervalů**: Když přepnete interval, znovu načte historická data a reconnectuje WebSocket

### WebSocket Připojení

- Připojuje se k: `wss://stream.binance.com:9443/ws/{symbol}@kline_{interval}`
- Aktualizace: Každou sekundu (nebo častěji podle tržní aktivity)
- Auto-Reconnect: Automaticky se znovu připojí pokud spojení spadne
- Status Indikátor: Zelená tečka ukazuje aktivní připojení

### OHLC Data

Info bar zobrazuje:
- **O (Open)**: První cena v časovém období
- **H (High)**: Nejvyšší cena v časovém období
- **L (Low)**: Nejnižší cena v časovém období
- **C (Close)**: Aktuální/poslední cena v časovém období

Barvy:
- 🟢 **Zelená**: Close > Open (býčí/rostoucí)
- 🔴 **Červená**: Close < Open (medvědí/klesající)

## 🛠️ Vývoj

### Sestavení ze Zdrojového Kódu

1. Naklonujte repozitář:
```bash
git clone https://github.com/yourusername/ha-candlestick-chart-card.git
cd ha-candlestick-chart-card
```

2. Nainstalujte závislosti:
```bash
npm install
```

3. Sestavte kartu:
```bash
npm run build
```

Zkompilovaný soubor bude v `dist/candlestick-chart-card.js`

### Vývojový Režim

Sledujte změny a automaticky znovu sestavujte:
```bash
npm run watch
```

## 📋 Požadavky

- Home Assistant 2021.3.0 nebo novější
- Připojení k internetu (pro přístup k Binance API)
- Moderní prohlížeč s podporou WebSocket

## ❓ Řešení Problémů

### Graf se nenačítá

- Zkontrolujte konzoli prohlížeče na chyby
- Ověřte, že symbol existuje na Binance (např. `BTCUSDT`)
- Zkontrolujte připojení k internetu
- Zkuste jiný symbol

### WebSocket se nepřipojuje (červený indikátor)

- Zkontrolujte nastavení firewallu
- Ověřte, že můžete přistupovat k `wss://stream.binance.com:9443`
- Zkuste obnovit stránku
- Zkontrolujte konzoli prohlížeče na WebSocket chyby

### Graf vypadá špatně nebo problémy se stylem

- Vymažte cache prohlížeče
- Tvrdé obnovení (Ctrl+F5 nebo Cmd+Shift+R)
- Zkontrolujte kompatibilitu s Home Assistant motivem
- Ověřte, že používáte kompatibilní verzi Home Assistant

### Nezobrazují se žádná data

- Ověřte, že symbol je správný (musí být velkými písmeny pro Binance)
- Zkontrolujte, zda je trh aktivní
- Zkuste populární symbol jako `BTCUSDT`
- Zkontrolujte síťovou záložku prohlížeče na API chyby

## 🌟 Technické Detaily

### Vytvořeno S

- [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/) - Rychlé, lehké finanční grafy
- [Binance WebSocket API](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams) - Real-time tržní data
- [Binance REST API](https://developers.binance.com/docs/binance-spot-api-docs/rest-api) - Historická candlestick data

### Výkon

- **Chart Knihovna**: Pouze ~50KB komprimováno
- **Aktualizace**: Zvládá více aktualizací za sekundu plynule
- **Paměť**: Efektivní využití paměti s automatickým čištěním
- **Responzivní**: ResizeObserver pro automatickou změnu velikosti grafu

### Podpora Prohlížečů

- Chrome/Edge: ✅ Plná podpora
- Firefox: ✅ Plná podpora
- Safari: ✅ Plná podpora
- Mobilní prohlížeče: ✅ Plná podpora

## 🤝 Přispívání

Příspěvky jsou vítány! Neváhejte odeslat Pull Request.

1. Forkněte repozitář
2. Vytvořte feature branch (`git checkout -b feature/skvela-funkce`)
3. Commitněte změny (`git commit -m 'Přidat skvělou funkci'`)
4. Pushněte do branch (`git push origin feature/skvela-funkce`)
5. Otevřete Pull Request

## 📄 Licence

MIT Licence - Viz soubor [LICENSE](LICENSE) pro detaily

## 💖 Podpora

Pokud je tato karta užitečná:
- ⭐ Dejte hvězdičku repozitáři na GitHubu
- 🐛 Nahlaste problémy na [issue trackeru](https://github.com/yourusername/ha-candlestick-chart-card/issues)
- 💡 Navrhněte nové funkce
- 📖 Vylepšete dokumentaci

## 🙏 Poděkování

- Vytvořeno s [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/)
- Tržní data z [Binance](https://www.binance.com/)
- Inspirováno profesionálními trading platformami jako TradingView

## ⚠️ Upozornění

Tato karta je pouze pro informační a vzdělávací účely. Zobrazuje real-time tržní data, ale neměla by být používána jako jediný základ pro obchodní rozhodnutí. Vždy si proveďte vlastní výzkum a konzultujte s finančními poradci před tradingem.

---

**Poznámka:** Toto je vlastní karta a není oficiálně podporována Home Assistant ani Binance.

Vytvořeno s ❤️ pro Home Assistant komunitu
