/* eslint-disable lit-a11y/no-autofocus */
import { html, css, LitElement } from 'lit';
import '@lrnwebcomponents/accent-card';

export class NasaImageSearch extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--nasa-image-search-text-color, #000);
        font-family: 'sans-serif';
        font-family: 'Open Sans', sans-serif;
      }

      img {
        display: block;
        margin-left: auto;
        margin-right: auto;
      }

      h2 {
        display: block;
        font-size: 3em;
        margin-top: 0.83em;
        margin-bottom: 0.83em;
        margin-left: 0;
        margin-right: 0;
        font-weight: bold;
      }

      .button1 {
        border: none;
        background-color: #ff7376;
        color: black;
        padding: 10px 22px;
        text-align: center;
        display: inline-block;
        font-size: 14px;
        margin: 2px 2px;
        cursor: pointer;
      }

      .button2 {
        border: none;
        background-color: #ff7376;
        color: black;
        padding: 10px 22px;
        text-align: center;
        display: inline-block;
        font-size: 14px;
        margin: 2px 2px;
        cursor: pointer;
      }

      input[type='text'] {
        width: 30%;
        padding: 8px 20px;
        margin: 8px 0;
        display: inline-block;
      }

      .center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
      }
    `;
  }

  static get properties() {
    return {
      searchTerm: { type: String, reflect: true },
      images: { type: Array },
    };
  }

  constructor() {
    super();
    this.images = [];
    this.searchTerm = '';
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'searchTerm' && this[propName]) {
        this.getData();
      } else if (propName === 'images') {
        this.render();
      } else if (propName === 'images') {
        this.dispatchEvent(
          new CustomEvent('results-changed', {
            detail: {
              value: this.images,
            },
          })
        );
      }
    });
  }

  getData() {
    const apiURL = 'https://images-api.nasa.gov/search?media_type=image&q=';
    fetch(apiURL + this.searchTerm)
      .then(response => response.json())
      .then(data => {
        this.images = [];
        const imageCollection = new Array(data.collection.items);
        for (let i = 0; i < imageCollection[0].length; i += 1) {
          this.images.push(imageCollection[0][i]);
        }
      });
  }

  updateSearchTerm() {
    this.searchTerm = this.shadowRoot.querySelector('#searchTerm').value;
  }

  clearFields() {
    this.shadowRoot.querySelector('#searchTerm').value = '';
    this.images = [];
  }

  render() {
    const detailsURL = 'https://images.nasa.gov/details-';
    return html`
      <img src="../assets/favicon-192.png" alt="nasa logo" style="width:128px;height:128px;">
      <h2 style="text-align:center">NASA Search!</h2>

      <div class="center">
        <button class="button1" @click=${this.clearFields}>Reset</button>
        <input type="text" id="searchTerm" autofocus title="search"></input>
        <button class="button2" @click=${this.updateSearchTerm}>Search!</button>
      </div>
      <br><br>
      ${this.images.map(
        item => html`
          <a href="${detailsURL}${item.data[0].nasa_id}" target="_blank">
            <accent-card
              image-src=${item.links[0].href}
              accent-color="red"
              horizontal
              style="max-width:300%;"
            >
              <div slot="heading">${item.data[0].title}</div>
              <div slot="content">${item.data[0].description}</div>
            </accent-card>
          </a>
        `
      )}
    `;
  }
}
