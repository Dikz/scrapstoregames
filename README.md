## [scrapstoregames]
A simple library for scraping of games and your offers
<hr>

#### Get game list in offers
> Data collection will be from all pages, so it may take a while
```js
const { OffersSteam } = require("scrapstoregames");

const steamoffers = new OffersSteam({ language: "portuguese" });

(async () => {
  let gamelist = await steamoffers.getGames();
  console.log(gamelist);
})();
```

#### Example of response
```js
{
    games: [{
    appID: '1131810',
    name: 'Gordon Streaman',
    link: 'https://store.steampowered.com/app/1131810/Gordon_Streaman/?snr=1_7_7_weeklongdeals_150_4',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/1131810/capsule_sm_120.jpg?t=1569509993',
    percent_discount: '40%',
    price: '8,69',
    price_discount: '5,21',
    released: '26 Set, 2019',
    platforms: [Object],
    tags: [Array],
    review: [Array]},
  total: 715,
  pages: '29',
  collect_timestamp: 1580867700689
}
```
