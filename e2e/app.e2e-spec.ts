import { BoopaheadPage } from './app.po';

describe('boopahead App', () => {
  let page: BoopaheadPage;

  beforeEach(() => {
    page = new BoopaheadPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
