import bookPage from "../page-objects/bookPage";
import userCredentials from "../fixtures/userCredentials.json";
import testData from "../fixtures/testData.json";
import apiEndPoints from "../fixtures/apiEndpoints.json";
import products from "../fixtures/products.json";
import dataRange from "../fixtures/data-range.json";

describe.skip('E2E UI Tests', () => {

  beforeEach(() => {
    bookPage.openHomePage();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    bookPage.login(userCredentials.username, userCredentials.password);
  });

  it('Add book to collection', () => {
    bookPage.getDisplayedUsername().then((displayedName) => {
      let displayName = displayedName.text();
      cy.log('username displayed : ' + displayName);
      expect(displayName.includes(userCredentials.username)).to.be.true;
    });

    bookPage.searchWithPublisher(testData.publisher);
    bookPage.getPublisherNameFromSearchResult().each(($element, index) => {
      let text = $element.text().trim();
      if (text.length > 0 && index > 0) {
        expect(text.includes(testData.publisher)).to.be.true;
      }
    });

    let authorName : string, title : string;
    bookPage.getAuthorNameFromSearchResult().each(($element, index) => {
      if (index == testData.bookSerial) {
        authorName = $element.text().trim();
        cy.log('author name : ' + authorName);
      }
    });
    bookPage.getTitleFromSearchResult().each(($element, index) => {
      if (index == testData.bookSerial) {
        title = $element.text().trim();
        cy.log('book title : ' + title);
      }
    });

    bookPage.openTitleBySerial(testData.bookSerial);
    bookPage.getTitleFromDetailPage().then(($bookTitle) => {
      expect($bookTitle.text().includes(title)).to.be.true;
    });

    bookPage.addBookToCollection();
    bookPage.navigateToProfileCollection();
    bookPage.getAuthorFromProfile().then(($author) => {
      expect($author.text().includes(authorName)).to.be.true;
    });
    bookPage.getBookTitleFromProfile().then(($bookTitle) => {
      expect($bookTitle.text().includes(title)).to.be.true;
    });
  });

  it('Delete book from collection', () => {
    bookPage.navigateToProfileCollection();
    bookPage.deleteBookFromCollection();
    cy.wait(3000);
    bookPage.getBookTitleFromProfile().then(($bookTitle) => {
      expect($bookTitle.text().trim()).to.be.empty;
    });
  });
});

describe('API Tests', () => {
  it('Get list of available products', () => {
    let endpoint = apiEndPoints.hostUrl + apiEndPoints.productsApi;
    cy.request("GET", endpoint).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      cy.writeFile('cypress/fixtures/products.json', { name: response.body[1].name });
    });
  });

  it('Get data range by product', () => {
    let endpoint = apiEndPoints.hostUrl + apiEndPoints.dataRangeApi.replace('{product}', products.name);
    cy.request("GET", endpoint).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      cy.writeFile('cypress/fixtures/data-range.json', { first: response.body.first, last: response.body.last });
    });
  });

  it('Get available statistics by product and range', () => {
    //let param = '?' + 'begin=' + dataRange.first + '&end=' + dataRange.last;
    let endpoint = apiEndPoints.hostUrl + apiEndPoints.statisticsApi.replace('{product}', products.name);
    cy.request({
      method: "GET", 
      url: endpoint,
      qs: {
        begin: dataRange.first,
        end: dataRange.last,
        interval: 'day'
      }}).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      cy.writeFile('cypress/fixtures/values.json', { value: response.body.value });
    });
  });
});