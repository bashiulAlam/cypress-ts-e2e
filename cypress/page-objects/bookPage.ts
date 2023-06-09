class bookPage {
    openHomePage() {
        cy.visit('/');
    }

    login(username : string, password : string) {
        cy.get('#login').click();
        cy.get('#userName').type(username);
        cy.get('#password').type(password);
        cy.get('#login').click();
    }

    getDisplayedUsername() {
        return cy.get('#userName-value');
    }

    searchWithPublisher(publisher : string) {
        cy.get('#searchBox').type(publisher);
        cy.get('#basic-addon2').click();
    }

    getPublisherNameFromSearchResult() {
        return cy.get('.rt-tr > :nth-child(4)');
    }

    getAuthorNameFromSearchResult() {
        return cy.get('.rt-tr > :nth-child(3)');
    }

    getTitleFromSearchResult() {
        return cy.get('.rt-tr > :nth-child(2)');
    }

    openTitleBySerial(serial : number) {
        let locator = ':nth-child(index) > .rt-tr > :nth-child(2) a';
        locator = locator.replace('index', String(serial));
        cy.get(locator).click();
    }

    getTitleFromDetailPage() {
        return cy.get('#title-wrapper > .col-md-9 > #userName-value');
    }

    addBookToCollection() {
        cy.contains('button', 'Add To Your Collection').click({force : true});
        cy.on('window:alert', (text) => {
            expect(text).to.contain('Book added to your collection.');
        });
    }

    navigateToProfileCollection() {
        cy.get(':nth-child(6) > .element-list > .menu-list > #item-3').click();
    }

    getBookTitleFromProfile() {
        return cy.get('.rt-tbody > :nth-child(1) > .rt-tr > :nth-child(2)');
    }

    getAuthorFromProfile() {
        return cy.get('.rt-tbody > :nth-child(1) > .rt-tr > :nth-child(3)');
    }

    deleteBookFromCollection() {
        cy.get('#delete-record-undefined').click();
        cy.get('#closeSmallModal-ok').click();
        cy.on('window:alert', (text) => {
            expect(text).to.contain('Book deleted.');
        });
    }
}

export default new bookPage();