import bookPage from "../page-objects/bookPage";
import userCredentials from "../fixtures/userCredentials.json";
import testData from "../fixtures/testData.json";

describe('E2E UI Tests', () => {

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
        //cy.log('checking text ' + $element.text());
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
})