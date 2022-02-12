/* eslint-disable lit-a11y/no-autofocus */
import { html, css, LitElement } from 'lit';
import '@lrnwebcomponents/accent-card';

// TODO: Connect startYear & endYear logic to html elements and then to api call
// TODO: Fix photographer/secondary_creator setup
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
      yearFinish: 'End Year',
    };
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

  firstUpdated() {}

  getData() {
    fetch(`${this.apiURL}&q=${this.searchTerm}&page=${this.page}`)
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
  }

  updateStartYear() {
    console.log(this.startYear);
    // let newStart = this.shadowRoot.querySelector('#startYear').value;
    // conditional that checks newStart > 1000
    // this.startYear = newStart
  }

  updateEndYear() {
    // conditional that checks shadowRoot for value > 1899
    console.log(this.endYear);
    // let newEnd = this.shadowRoot.querySelector('#endYear').value;
    // conditional that checks newEnd > 1000
    // this.startYear = newEnd
  }

  clearFields() {
    this.shadowRoot.querySelector('#searchTerm').value = '';
    this.images = [];
    this.searchTerm = '';
  }

  handleKeypress(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.updateSearchTerm();
    }
  }

  render() {
    const detailsURL = 'https://images.nasa.gov/details-';
    const imageURL = new URL('../assets/favicon-192.png', import.meta.url).href;
    return html`
      <img src="${imageURL}" alt="nasa logo" style="width:128px;height:128px;">
      <h2 style="text-align:center">NASA Search!</h2>

      <div class="center">
        <button 
          class="button1" 
          @click=${this.clearFields}> Reset
        </button>
        
        <input 
          type="text" 
          id="searchTerm" 
          .placeholder="${this.t.searchBox}"
          autofocus
          @keyup=${e => {
            this.handleKeypress(e);
          }}
          aria-label="Enter Search Term"
        >
        </input>

        <button 
          class="button2" 
          @click=${this.updateSearchTerm} 
          aria-label="Search button" > Search!
        </button>
      </div>

      <div class="center">
          <input 
            type="number" 
            id="yearBox"
            .placeholder="${this.t.yearStart}"
            title="number"
            aria-label="Enter Starting Year"> -
          </input>

          <input 
            type="number" 
            id="yearBox"
            .placeholder="${this.t.yearFinish}"
            title="number"
            aria-label="Enter Ending Year">
          </input>

        <button class="accentcard" aria-label="Switch to Card View"> Card View </button>
        <button class="list" aria-label="Switch to List View"> List View </button>
      </div>

    <div class="center">
      <input 
          type="number" 
          id="pageBox"
          .placeholder="${this.t.pageNumber}">
      </input>
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
