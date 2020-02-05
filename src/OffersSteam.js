const steam = require('./utils/steam');
const cheerio = require('cheerio');

class OffersSteam {
  /**
   * @param {Object} config (Object) Configuration of scrapping
   * @param {string} config.type Default: weeklongdeals
   * @param {string} config.language Default: english
   * @example
   * type: 'weeklongdeals'
   * language: 'english'
   */
  constructor(config = {}) {
    let { type = 'weeklongdeals', language = 'english' } = config;

    this.type = type;
    this.language = language;
    this.options = {
      params: {
        l: this.language,
        filter: this.type,
        page: 1,
      },
    };
  }

  /**
   * Method to fetch number of pages
   * @async
   * @return {Promise<number>} Returns the number of pages
   */
  async getPages() {
    let response = await steam(this.options);
    const $ = cheerio.load(response.data);

    let pages = $('.search_pagination_right a')
      .eq(2)
      .text();
    return pages;
  }

  /**
   * Get game list in promotion/offers
   * @async
   * @return {Promise<*>} Game list and other details of the collect
   * @example
   * games: [] // Array
   * total: 10 // Number
   * pages: '1' // String
   * collect_timestamp: 1580844302139 // Number - timestamp
   */
  async getGames() {
    let gameList = [];
    let pages = await this.getPages();

    for (let i = 1; i <= pages; i++) {
      this.options.params.page = i;
      let response = await steam(this.options);
      let $ = cheerio.load(response.data);

      let games = $('#search_resultsRows a');

      games.each(function(index, element) {
        let platforms = $(this).find('.search_name p');
        let appID = $(this).attr('data-ds-appid');

        let prices = $(this)
          .find('.search_price_discount_combined .search_price.discounted')
          .text()
          .trim()
          .replace(/\s/gm, '')
          .split('R$')
          .splice(1);

        let tags = $(
          `.hover_app_${appID} .hover_body .hover_tag_row .app_tag`
        ).map(function() {
          $(this).text();
        });

        gameList.push({
          appID,
          name: $(this)
            .find('.search_name span.title')
            .text(),
          link: $(this).attr('href'),
          image: $(this)
            .find('img')
            .attr('src'),
          percent_discount: $(this)
            .find('.search_price_discount_combined .search_discount span')
            .text()
            .replace('-', ''),
          price: prices[0],
          price_discount: prices[1],
          released: $(this)
            .find('.search_released')
            .text(),
          platforms: {
            windows: $(platforms).find('.win').length ? true : false,
            mac: $(platforms).find('.mac').length ? true : false,
            linux: $(platforms).find('.linux').length ? true : false,
          },
          tags: $(this).attr('data-ds-tagids')
            ? $(this)
                .attr('data-ds-tagids')
                .replace(/\[|\]/gm, '')
                .split(',')
            : [],
          review: String(
            $(this)
              .find('.search_reviewscore .search_review_summary')
              .attr('data-tooltip-html')
          ).split(/<br>/gm),
        });
      });
    }

    const data = {
      games: gameList,
      total: gameList.length,
      pages,
      collect_timestamp: Date.now(),
    };

    this.resetOptions();

    return data;
  }

  resetOptions() {
    this.options = {
      params: {
        l: this.language,
        filter: this.type,
        page: 1,
      },
    };
  }
}

module.exports = OffersSteam;
