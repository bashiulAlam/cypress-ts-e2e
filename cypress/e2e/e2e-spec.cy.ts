import bookPage from "../page-objects/bookPage";
import userCredentials from "../fixtures/userCredentials.json";

describe('E2E UI Tests', () => {

  before(() => {
    bookPage.openHomePage();
    bookPage.login(userCredentials.username, userCredentials.password);
    bookPage.validateLogin(userCredentials.username);
  });

  it.skip('', () => {});
})