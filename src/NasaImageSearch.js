import { html, css, LitElement } from 'lit';

export class NasaImageSearch extends LitElement {
  static get tag() {
    return 'nasa-image-search';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--nasa-image-search-text-color, #000);
      }
    `;
  }

  static get properties() {
    return {
      nasaResults: { type: Array },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getNASAData();
  }

  async getNASAData() {
    return fetch('https://images-api.nasa.gov/search?q=rocket&page=1')
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        this.nasaResults = [];

        data.collection.items.forEach(element => {
          const moonInfo = {
            imagesrc: new URL(element.links[0].href, import.meta.url).href,
            title: element.data[0].title,
            description: element.data[0].description,
          };
          console.log(moonInfo);
          this.nasaResults.push(moonInfo);
        });
        return data;
      });
  }

  constructor() {
    super();
    this.nasaResults = [];
  }

  render() {
    return html`
      ${this.nasaResults.map(
        item => html`
          <accent-card imagesrc="${item.imagesrc}">
            <div slot="heading">${item.title}</div>
            <div slot="content">${item.description}</div>
          </accent-card>
        `
      )}
    `;
  }
}
