import { html, css, LitElement } from 'lit';
import '@lrnwebcomponents/accent-card';

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

      :host([view='list']) ul {
        margin: 20px;
      }
    `;
  }

  static get properties() {
    return {
      nasaResults: { type: Array },
      loadData: { type: Boolean, reflect: true, attribute: 'load' },
      view: { type: String, reflect: true },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getNASAData();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'loadData' && this[propName]) {
        this.getNASAData();
      } else if (propName === 'nasaResults') {
        this.dispatchEvent(
          new CustomEvent('results-changed', {
            detail: {
              value: this.nasaResults,
            },
          })
        );
      }
    });
  }

  async getNASAData() {
    return fetch(
      'https://images-api.nasa.gov/search?q=moon&page=1&media_type=image'
    )
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
          if (element.links[0].href !== undefined) {
            const moonInfo = {
              imagesrc: element.links[0].href,
              title: element.data[0].title,
              description: element.data[0].description,
            };
            console.log(moonInfo);
            this.nasaResults.push(moonInfo);
          }
        });
        return data;
      });
  }

  static getDataOnly() {
    if (document.getElementById('dataOnly').checked) {
      // not empty
      console.log('were here');
      const cards = document.getElementById('cards');
      cards.parentNode.removeChild(cards);
    } else {
      // not empty
      // make sure render function gets called again
    }
  }

  resetData() {
    this.nasaResults = [];
    this.loadData = false;
  }

  constructor() {
    super();
    this.nasaResults = [];
    this.loadData = false;
    this.view = 'accent-card';
  }
  // this is purely so my vscode will push to github

  render() {
    return html`
      ${this.view === `list`
        ? html`
            <ul>
              ${this.nasaResults.map(
                item => html`
                  <li>
                    ${item.imagesrc} - ${item.title} - ${item.description}
                  </li>
                `
              )}
            </ul>
            <div>
              <input
                type="checkbox"
                id="dataOnly"
                name="dataOnly"
                onCheck="getDataOnly();"
                unchecked
              />
              <label for="dataOnly">Data Only</label>
            </div>
            <br />
          `
        : html`
            ${this.nasaResults.map(
              item => html`
                <accent-card
                  image-src="${item.imagesrc}"
                  image-align="right"
                  horizontal
                  id="cards"
                >
                  <div slot="heading">${item.title}</div>
                  <div slot="content">${item.description}</div>
                  <div slot="secondary_creator">${item.creator}</div>
                </accent-card>
              `
            )}
          `}
    `;
  }
}
