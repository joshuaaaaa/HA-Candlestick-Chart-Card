# Candlestick Chart Card pro Home Assistant

Vlastní karta pro Home Assistant Lovelace, která zobrazuje data ze senzorů jako interaktivní svíčkové grafy s více časovými intervaly.

![Candlestick Chart Card](https://img.shields.io/badge/verze-1.0.0-blue)

## Funkce

- 📊 **Krásné svíčkové grafy** - Zobrazujte data ze senzorů v profesionálních grafech ve stylu obchodování
- ⏱️ **Více časových intervalů** - Přepínejte mezi zobrazením 10 minut, 30 minut, 1 hodina a 1 den
- 🎨 **Barevné kódování** - Zelené svíčky pro rostoucí hodnoty, červené pro klesající
- 🔍 **Interaktivní** - Přibližujte, posouvejte a prozkoumávejte data s vestavěnými nástroji grafu
- 🎯 **Snadná konfigurace** - Jednoduchá konfigurace YAML
- 🌓 **Podpora motivů** - Automaticky se přizpůsobuje vašemu motivu Home Assistant

## Instalace

### HACS (doporučeno)

1. Otevřete HACS ve vaší instanci Home Assistant
2. Klikněte na "Frontend"
3. Klikněte na tlačítko "+"
4. Vyhledejte "Candlestick Chart Card"
5. Klikněte na "Instalovat"

### Manuální instalace

1. Stáhněte soubor `candlestick-chart-card.js` z [nejnovějšího vydání](https://github.com/yourusername/ha-candlestick-chart-card/releases)
2. Zkopírujte soubor do adresáře `config/www/` vašeho Home Assistanta
3. Přidejte následující do vašeho `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/candlestick-chart-card.js
      type: module
```

4. Restartujte Home Assistant

## Konfigurace

### Základní konfigurace

```yaml
type: custom:candlestick-chart-card
entity: sensor.vas_senzor
title: "Můj svíčkový graf"
```

### Úplná konfigurace

```yaml
type: custom:candlestick-chart-card
entity: sensor.vas_senzor
title: "Můj svíčkový graf"
intervals:
  - 10m
  - 30m
  - 1h
  - 1d
default_interval: 1h
hours_to_show: 24
height: 400
```

### Možnosti konfigurace

| Možnost | Typ | Výchozí | Popis |
|---------|-----|---------|-------|
| `entity` | string | **Povinné** | ID entity senzoru k zobrazení |
| `title` | string | `"Candlestick Chart"` | Název karty |
| `intervals` | pole | `['10m', '30m', '1h', '1d']` | Dostupné časové intervaly |
| `default_interval` | string | `'1h'` | Výchozí vybraný interval |
| `hours_to_show` | number | `24` | Počet hodin historických dat k načtení |
| `height` | number | `400` | Výška grafu v pixelech |

### Časové intervaly

- `10m` - 10 minut na svíčku (zobrazuje posledních 2 hodiny)
- `30m` - 30 minut na svíčku (zobrazuje posledních 6 hodin)
- `1h` - 1 hodina na svíčku (zobrazuje posledních 24 hodin)
- `1d` - 1 den na svíčku (zobrazuje posledních 30 dní)

## Příklady

### Senzor ceny akcií

```yaml
type: custom:candlestick-chart-card
entity: sensor.cena_akcii
title: "Výkonnost akcií"
intervals:
  - 30m
  - 1h
  - 1d
default_interval: 1h
height: 500
```

### Teplotní senzor

```yaml
type: custom:candlestick-chart-card
entity: sensor.venkovni_teplota
title: "Teplotní trendy"
intervals:
  - 1h
  - 1d
default_interval: 1d
```

### Monitor energie

```yaml
type: custom:candlestick-chart-card
entity: sensor.spotreba_energie
title: "Spotřeba energie"
intervals:
  - 10m
  - 30m
  - 1h
default_interval: 30m
height: 450
```

## Jak to funguje

Karta načítá historická data z vašeho Home Assistant recorderu a zpracovává je do formátu svíček:

- **Otevření**: První hodnota v časovém intervalu
- **Maximum**: Nejvyšší hodnota v časovém intervalu
- **Minimum**: Nejnižší hodnota v časovém intervalu
- **Zavření**: Poslední hodnota v časovém intervalu

Svíčky jsou barevně rozlišeny:
- 🟢 **Zelená**: Zavírací hodnota je vyšší než otevírací (stoupající)
- 🔴 **Červená**: Zavírací hodnota je nižší než otevírací (klesající)

## Vývoj

### Sestavení ze zdrojového kódu

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

### Vývojový režim

Sledujte změny a automaticky znovu sestavujte:
```bash
npm run watch
```

## Požadavky

- Home Assistant 2021.3.0 nebo novější
- Povolená integrace Recorder
- Historická data pro senzor, který chcete zobrazit

## Řešení problémů

### Graf je prázdný

- Ujistěte se, že je povolena integrace recorder
- Zkontrolujte, že váš senzor má historická data
- Ověřte, že ID entity je správné
- Zkontrolujte konzoli prohlížeče na chyby

### Graf se neaktualizuje

- Ověřte, že se senzor stále aktualizuje novými hodnotami
- Zkontrolujte konfiguraci `hours_to_show`
- Zkuste obnovit stránku

### Problémy se stylováním

- Vymažte mezipaměť prohlížeče
- Tvrdé obnovení (Ctrl+F5 nebo Cmd+Shift+R)
- Zkontrolujte, že používáte kompatibilní verzi Home Assistant

## Poděkování

Vytvořeno s:
- [ApexCharts](https://apexcharts.com/) - Moderní knihovna pro grafy
- [Lit](https://lit.dev/) - Knihovna pro webové komponenty

## Licence

MIT License - Viz soubor [LICENSE](LICENSE) pro detaily

## Přispívání

Příspěvky jsou vítány! Neváhejte odeslat Pull Request.

## Podpora

Pokud je tato karta užitečná, dejte jí prosím ⭐ na GitHubu!

Pro problémy a žádosti o funkce použijte [GitHub issue tracker](https://github.com/yourusername/ha-candlestick-chart-card/issues).

---

**Poznámka:** Toto je vlastní karta a není oficiálně podporována Home Assistant.
