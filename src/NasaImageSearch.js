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
        padding-top: 10px;
      }

      .button1 {
        border: none;
        border-radius: 3px 0px 0px 3px;
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
        border-radius: 0px 3px 3px 0px;
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

      input[type='number'] {
        width: 70px;
        padding: 8px 20px 3px;
        margin: 20px 8px;
        display: inline-block;
      }

      .accentcard {
        display: inline-block;
        background-color: #ff7376;
        border: none;
        border-radius: 3px;
        padding: 8px 20px;
        margin: 20px 2px;
        height: 30.5px;

        font-size: 10px;
        cursor: pointer;
      }

      .list {
        display: inline-block;
        background-color: #ff7376;
        border: none;
        border-radius: 3px;
        padding: 8px 20px;
        margin: 20px 0px;
        height: 30.5px;

        font-size: 10px;
        cursor: pointer;
      }

      .center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
      }

      .photoCredit {
        font-style: italic;
      }
    `;
  }

  static get properties() {
    return {
      searchTerm: { type: String, reflect: true },
      images: { type: Array },
      apiURL: { type: String },
      page: { type: String, reflect: true },
      startYear: { type: String },
      endYear: { type: String },
      view: { type: String, reflect: true },
      loadData: { type: Boolean, reflect: true, attribute: 'load' },
    };
  }

  constructor() {
    super();
    this.images = [];
    this.apiURL = 'https://images-api.nasa.gov/search?media_type=image';
    this.searchTerm = '';
    this.page = '1';
    this.startYear = '1000';
    this.endYear = '2022';
    this.t = {
      pageNumber: 'Pages',
      searchBox: 'Search... (ex. Moon, Stars...)',
      yearStart: 'Start Year',
      yearEnd: 'End Year',
    };
    this.loadData = false;
    this.view = 'accent-card';
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'loadData' && this[propName]) {
        console.log('load data changed');
        this.getNASAData();
      }
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

  firstUpdated() {}

  getData() {
    fetch(
      `${this.apiURL}&q=${this.searchTerm}&page=${this.page}&year_start=${this.startYear}&year_end=${this.endYear}`
    )
      .then(response => response.json())
      .then(data => {
        this.images = [];
        const imageCollection = new Array(data.collection.items);
        for (let i = 0; i < imageCollection[0].length; i += 1) {
          // next three lines take photographer info from secondary_creator and photographer fields and put into one uniform variable
          let photographerInfo = imageCollection[0][i].data[0].secondary_creator
            ? imageCollection[0][i].data[0].secondary_creator
            : 'unknown';
          photographerInfo = imageCollection[0][i].data[0].photographer
            ? imageCollection[0][i].data[0].photographer
            : photographerInfo;
          imageCollection[0][i].data[0].photographerInfo = photographerInfo;

          this.images.push(imageCollection[0][i]);
        }
      });
  }

  updateSearchTerm() {
    this.searchTerm = this.shadowRoot.querySelector('#searchTerm').value;
    this.getData();
  }

  updateStartYear() {
    const newStart = this.shadowRoot.querySelector('#yearStart').value;
    this.startYear = newStart > 1000 ? newStart : this.startYear;
  }

  updateEndYear() {
    const newEnd = this.shadowRoot.querySelector('#yearEnd').value;
    this.endYear = newEnd > 1900 ? newEnd : this.endYear;
  }

  clearFields() {
    this.shadowRoot.querySelector('#searchTerm').value = '';
    this.startYear = '1000';
    this.shadowRoot.querySelector('#yearStart').value = '';
    this.EndYear = '2022';
    this.shadowRoot.querySelector('#yearEnd').value = '';
    this.page = '1';
    this.shadowRoot.querySelector('#pageInput').value = this.page;

    this.images = [];
    this.searchTerm = '';
  }

  handleKeypress(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.updateSearchTerm();
    }
  }

  _updatePage() {
    if (this.shadowRoot.querySelector('#pageInput').value > 0) {
      this.page = this.shadowRoot.querySelector('#pageInput').value;
    }
  }

  changeViewCard() {
    this.view = 'accent-card';
  }

  changeViewList() {
    this.view = 'list';
  }

  render() {
    const detailsURL = 'https://images.nasa.gov/details-';
    const imageURL = new URL('../assets/favicon-192.png', import.meta.url).href;
    return html`
      <img
        src="${imageURL}"
        alt="nasa logo"
        style="width:128px;height:128px;"
      />
      <h2 style="text-align:center">NASA Search!</h2>

      <div class="center">
        <button class="button1" @click=${this.clearFields}>Reset</button>

        <input
          type="text"
          id="searchTerm"
          .placeholder="${this.t.searchBox}"
          autofocus
          @keyup=${e => {
            this.handleKeypress(e);
          }}
          aria-label="Enter Search Term"
        />

        <button
          class="button2"
          @click=${this.updateSearchTerm}
          aria-label="Search button"
        >
          Search!
        </button>
      </div>

      <div class="center">
        <input
          type="number"
          id="yearStart"
          .placeholder="${this.t.yearStart}"
          title="number"
          @change=${this.updateStartYear}
          aria-label="Enter Starting Year"
        />
        -
        <input
          type="number"
          id="yearEnd"
          .placeholder="${this.t.yearEnd}"
          title="number"
          @change=${this.updateEndYear}
          aria-label="Enter Ending Year"
        />

        <button
          class="accentcard"
          aria-label="Switch to Card View"
          @click=${this.changeViewCard}
        >
          Card View
        </button>
        <button
          class="list"
          aria-label="Switch to List View"
          @click=${this.changeViewList}
        >
          List View
        </button>
      </div>

      <div class="center">
        <label for="page">Page Number: </label>
        <input
          type="number"
          id="pageInput"
          min="1"
          value="1"
          class="pageInput"
          @change="${this._updatePage}"
        />
      </div>

      <br /><br />
      ${this.view === `list`
        ? html`
            <ul>
              ${this.images.map(
                item => html`
                  <li>
                    <a href="${item.links[0].href}"> ${item.links[0].href} </a>
                    - ${item.data[0].title} - ${item.data[0].description}
                  </li>
                `
              )}
            </ul>
          `
        : html`
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
                    <div slot="content">
                      ${item.data[0].description}
                      <br />
                      <p class="photoCredit">
                        Photographed by: ${item.data[0].photographerInfo}
                      </p>
                    </div>
                  </accent-card>
                </a>
              `
            )}
          `}
      <script>
        var searchField = this.shadowRoot.querySelector(#searchTerm)

        searchField.addEventListener("keyup", function(event) {
          console.log("some event")
          // Number 13 is the "Enter" key on the keyboard
          if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            this.shadowRoot.querySelector(".button2").click();
            console.log("enter enter enter")
          }
        });
      </script>
    `;
  }
}
