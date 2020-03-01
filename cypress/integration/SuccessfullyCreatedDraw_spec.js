describe('Successfully created draw', () => {
  ['macbook-13'].forEach(device => {
    context(`Device ${device}`, () => {
      beforeEach(() => {
        cy.server();
        // cy.mockFixture('Raffle');
        cy.mockGA();
        cy.viewport(device);
      });

      describe('When the user is the owner', () => {
        beforeEach(() => {
          const mockRecentDraws = [
            {
              id: 'b29f44c2-1022-408a-925f-63e5f77a12ad',
              title: 'Sorteo de grupos aleatorios',
              url: '/groups/b29f44c2-1022-408a-925f-63e5f77a12ad',
            },
          ];
          window.localStorage.setItem('recentDraws', JSON.stringify(mockRecentDraws));
        });
        it('analytics events are sent', () => {
          cy.visit('/groups/b29f44c2-1022-408a-925f-63e5f77a12ad/success');

          cy.get('@ga')
            .should('be.calledWith', 'create', 'UA-XXXXX-Y')
            .and('be.calledWith', 'send', {
              hitType: 'pageview',
              page: '/groups/b29f44c2-1022-408a-925f-63e5f77a12ad/success',
            });
        });

        it('Should show share buttons', () => {
          cy.mockWindowOpen();
          cy.visit('/groups/b29f44c2-1022-408a-925f-63e5f77a12ad/success');
          cy.getComponent('SocialButton__whatsapp').click();
          cy.get('@ga').and('be.calledWith', 'send', {
            hitType: 'event',
            eventCategory: 'Groups',
            eventAction: 'Social Share Draw',
            eventLabel: 'whatsapp',
          });
          cy.get('@winOpen').and('be.calledOnce');
        });

        it('Should have a button to redirect to the draw', () => {
          cy.mockWindowOpen();
          cy.visit('/groups/b29f44c2-1022-408a-925f-63e5f77a12ad/success');
          cy.getComponent('SuccessfullyCreatedDraw_GoToRaffleButton').click();
          cy.location('pathname').should('eq', '/groups/b29f44c2-1022-408a-925f-63e5f77a12ad');
        });
      });

      it('When the user is not the owner should automatically redirect to the draw', () => {
        cy.visit('/groups/b29f44c2-1022-408a-925f-63e5f77a12ad/success');
        cy.location('pathname').should('eq', '/groups/b29f44c2-1022-408a-925f-63e5f77a12ad');
      });
    });
  });
});