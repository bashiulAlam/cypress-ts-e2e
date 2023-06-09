import bookPage from "../page-objects/bookPage";
import userCredentials from "../fixtures/userCredentials.json";
import testData from "../fixtures/testData.json";
import apiEndPoints from "../fixtures/apiEndpoints.json";
import products from "../fixtures/products.json";
import dataRange from "../fixtures/data-range.json";
import values from "../fixtures/values.json";

describe.skip('E2E UI Tests', () => {

  beforeEach(() => {
    bookPage.openHomePage();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    bookPage.login(userCredentials.username, userCredentials.password);
  });

  it('Add book to collection', () => {
    //validate that correct username is displayed after login
    bookPage.getDisplayedUsername().then((displayedName) => {
      let displayName = displayedName.text();
      cy.log('username displayed : ' + displayName);
      expect(displayName.includes(userCredentials.username)).to.be.true;
    });

    //search with publisher and validate the search result by publisher name
    bookPage.searchWithPublisher(testData.publisher);
    bookPage.getPublisherNameFromSearchResult().each(($element, index) => {
      let text = $element.text().trim();
      if (text.length > 0 && index > 0) {
        expect(text.includes(testData.publisher)).to.be.true;
      }
    });

    let authorName : string, title : string;
    //save the author name for validation purposes later
    bookPage.getAuthorNameFromSearchResult().each(($element, index) => {
      if (index == testData.bookSerial) {
        authorName = $element.text().trim();
        cy.log('author name : ' + authorName);
      }
    });
    //save the book title for validation purposes later
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

    //add book to collection and then navigate to profile and validate correct book has been added by checking book title and author name
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
    //delete the book from collection
    bookPage.navigateToProfileCollection();
    bookPage.deleteBookFromCollection();
    cy.wait(3000);

    //check that collection is empty
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

      //write the product name in file to use it in the following tests
      cy.writeFile('cypress/fixtures/products.json', { name: response.body[0].name });
    });
  });

  it('Get data range by product', () => {
    let endpoint = apiEndPoints.hostUrl + apiEndPoints.dataRangeApi.replace('{product}', products.name);
    cy.request("GET", endpoint).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);

      //write the range data in file to use it in the following test
      cy.writeFile('cypress/fixtures/data-range.json', { first: response.body.first, last: response.body.last });
    });
  });

  it('Get available statistics by product and range', () => {
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

      //write the params of one value object in file and validate that they are all numbers
      cy.writeFile('cypress/fixtures/values.json', { value: response.body[0].value });

      expect(typeof values.value.average).to.eq('number');
      expect(typeof values.value.count).to.eq('number');
      expect(typeof values.value.max).to.eq('number');
      expect(typeof values.value.min).to.eq('number');
      expect(typeof values.value["standard deviation"]).to.eq('number');
    });
  });
});