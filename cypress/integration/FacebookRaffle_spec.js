describe('FacebookRaffle', () => {
  ['macbook-13' /* 'iphone-5' */].forEach(device => {
    context(`Device ${device}`, () => {
      beforeEach(() => {
        cy.server();
        cy.mockGA();
        cy.mockFixture('FacebookRaffle');
        cy.viewport(device);
      });

      describe('Public Draw', () => {
        describe('Analytics', () => {
          it('Events sent on pageview', () => {
            cy.visit('/facebook');

            cy.get('@ga')
              .should('be.calledWith', 'create', 'UA-XXXXX-Y')
              .and('be.calledWith', 'send', { hitType: 'pageview', page: '/facebook' });
          });

          it('Events sent on publish', () => {
            cy.visit('/facebook');
            cy.getComponent('FacebookRaffle__prizes-field-input').type('prize1, prize2');
            cy.getComponent('WizardForm__next-button').click();
            cy.getComponent('WizardForm__next-button').click();
            cy.getComponent('WizardForm__next-button').click();
            cy.get('@ga').should('be.calledWith', 'send', {
              hitType: 'event',
              eventCategory: 'Facebook',
              eventAction: 'Publish',
              eventLabel: 'b29f44c2-1022-408a-925f-63e5f77a12ad',
            });
          });
        });

        describe('Creation page', () => {
          it('Google Analytics pageview event is sent', () => {
            cy.visit('/facebook');

            cy.get('@ga')
              .should('be.calledWith', 'create', 'UA-XXXXX-Y')
              .and('be.calledWith', 'send', { hitType: 'pageview', page: '/facebook' });
          });

          it('It should be possible to create a raffle', () => {
            cy.visit('/facebook');

            // Make required errors show up
            cy.getComponent('WizardForm__next-button').click();

            // It should error if prizes is empty
            cy.getComponent('FacebookRaffle__prizes-field').shouldHaveError();
            cy.getComponent('FacebookRaffle__prizes-field-input').type('Prize 1,');
            cy.getComponent('FacebookRaffle__prizes-field').shouldNotHaveError();

            // Go to second step
            cy.getComponent('WizardForm__next-button').click();

            // The title field should have a default value
            cy.getComponent('PublicDetails__title-field-input').should('not.have.value', '');

            // Fill title and description and submit the step
            cy.getComponent('PublicDetails__title-field-input')
              .clear()
              .type('The title');
            cy.getComponent('PublicDetails__description-field-input').type('A cool description');

            // Go to third step
            cy.getComponent('WizardForm__next-button').click();

            // Submit the draw
            cy.getComponent('WizardForm__next-button').click();

            cy.get('@ga').should('be.calledWith', 'send', {
              hitType: 'event',
              eventCategory: 'Facebook',
              eventAction: 'Publish',
              eventLabel: 'b29f44c2-1022-408a-925f-63e5f77a12ad',
            });

            cy.mockedRequestWait('POST', '/api/raffle')
              .its('requestBody')
              .should('deep.eq', {
                title: 'The title',
                description: 'A cool description',
                participants: [],
                prizes: [{ name: 'Prize 1' }],
              });
            cy.mockedRequestWait('POST', '/api/raffle/29080f6b-b3e4-412c-8008-7e26081ea17c/toss');
            cy.get('@ga').should('be.calledWith', 'send', {
              hitType: 'event',
              eventCategory: 'Facebook',
              eventAction: 'Publish',
              eventLabel: 'b29f44c2-1022-408a-925f-63e5f77a12ad',
            });

            // Redirect to draw with the public id
            cy.location('pathname').should('eq', '/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad');
          });
        });

        it('Should show feedback if there are server errors', () => {
          cy.visit('/facebook');
          cy.route({
            method: 'POST',
            url: '/api/raffle/',
            status: 503,
            response: {},
          }).as('failedRequest');
          cy.getComponent('FacebookRaffle__prizes-field-input').type('prize1, prize2,');
          cy.getComponent('WizardForm__next-button').click();
          cy.getComponent('WizardForm__next-button').click();
          cy.getComponent('WizardForm__next-button').click();
          cy.wait('@failedRequest');
          cy.getComponent('ErrorFeedback').should('be.visible');

          // It should recover form the error
          cy.mockFixture('FacebookRaffle'); // Reset the mock with the 200 response
          cy.getComponent('WizardForm__next-button').click();
          cy.getComponent('ErrorFeedback').should('not.exist');
        });
      });

      describe('Published page', () => {
        it('Analytics events sent on pageview', () => {
          cy.visit('/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad');

          cy.get('@ga')
            .should('be.calledWith', 'create', 'UA-XXXXX-Y')
            .and('be.calledWith', 'send', {
              hitType: 'pageview',
              page: '/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad',
            });
        });

        describe('Before results published', () => {
          beforeEach(() => {
            cy.clock(new Date().getTime());

            // Mocking a draw in the future
            const missingSeconds = 2;
            const now = new Date();
            now.setSeconds(now.getSeconds() + missingSeconds);
            const dateInFuture = now.toISOString();
            cy.fixture('FacebookRaffle').then(fixtures => {
              const fixtureGetRaffle = fixtures.find(
                fixture => fixture.path === '/api/raffle/b29f44c2-1022-408a-925f-63e5f77a12ad',
              );
              fixtureGetRaffle.response.results[0].schedule_date = dateInFuture;
              fixtureGetRaffle.response.results[0].value = null;
              cy.route(
                fixtureGetRaffle.method,
                fixtureGetRaffle.path,
                fixtureGetRaffle.response,
              ).as('LoadData');
            });
          });

          it('should have Facebook login button if the user is not logged in Facebook yet', () => {
            cy.visit('/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad');
            cy.window().then(win => {
              // eslint-disable-next-line no-param-reassign
              win.FB.api = cy
                .spy((endpoint, options, callback) => {
                  callback({ id: '000001', name: 'Mr Nobody' });
                })
                .as('FbApi');
            });

            // Status is automatically changed by FBProvider when initialized
            // We are triggering the statusChange manually for the tests
            cy.wait('@LoadData').then(() =>
              cy.window().then(win => {
                win.cypressEas.statusChange({ status: 'unknown' });
              }),
            );
            cy.getComponent('FacebookLoginButton').should('exist');
          });

          it('should have button to participate if the user is already logged in Facebook', () => {
            cy.visit('/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad');
            cy.window().then(win => {
              // eslint-disable-next-line no-param-reassign
              win.FB.api = cy
                .spy((endpoint, options, callback) => {
                  callback({ id: '000000', name: 'Mr Nobody' });
                })
                .as('FbApi');
            });

            // Status is automatically changed by FBProvider when initialized
            cy.wait('@LoadData').then(() =>
              cy.window().then(win => {
                win.cypressEas.statusChange({ status: 'connected', authResponse: true });
              }),
            );
            cy.get('@FbApi').should('be.calledWith', '/me', {});
            cy.getComponent('FacebookRaffle__participant-button')
              .should('contain', 'Mr Nobody')
              .click();

            cy.mockedRequestWait(
              'POST',
              '/api/raffle/b29f44c2-1022-408a-925f-63e5f77a12ad/participants',
            )
              .its('requestBody')
              .should('deep.eq', {
                name: 'Mr Nobody',
                facebook_id: '000000',
              });
            cy.wait('@LoadData');
          });

          it('should have indicate when the user is already a participant', () => {
            cy.visit('/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad');
            cy.window().then(win => {
              // eslint-disable-next-line no-param-reassign
              win.FB.api = cy
                .spy((endpoint, options, callback) => {
                  callback({ id: '000001', name: 'Mr Someone' });
                })
                .as('FbApi');
            });

            // Status is automatically changed by FBProvider when initialised
            cy.wait('@LoadData').then(() =>
              cy.window().then(win => {
                win.cypressEas.statusChange({ status: 'connected', authResponse: true });
              }),
            );
            cy.get('@FbApi').should('be.calledWith', '/me', {});
            cy.getComponent('FacebookRaffle__participant-registered').should(
              'contain',
              'Mr Someone',
            );
          });

          it('Should show the countdown if there are not results', () => {
            // The draw is scheduled in 2 seconds when mocked
            const missingSeconds = 2;

            cy.visit('/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad');
            cy.wait('@LoadData');
            cy.getComponent('Countdown').should('be.visible');

            // Fast forward the countdown
            cy.tick((missingSeconds + 1) * 1000);

            // Once the countdown is over, the the api should be called again
            cy.wait('@LoadData');
          });
        });

        describe('After results published', () => {
          it.only('Should show results and the raffle details', () => {
            cy.visit('/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad');
            cy.mockedRequestWait('GET', '/api/raffle/b29f44c2-1022-408a-925f-63e5f77a12ad');
            cy.getComponent('DrawHeading__title').contains('This is the title');
            cy.getComponent('WinnersList__result').should('have.length', 1);
            cy.getComponent('FacebookRaffle__number-of-participants').should('contain', 2);

            // Non winners should not be shown
            cy.contains('Participant 1').should('not.exist');
          });

          it('Should show share buttons', () => {
            cy.mockWindowOpen();
            cy.visit('/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad');
            cy.getComponent('SocialButton__whatsapp').click();
            cy.get('@ga').and('be.calledWith', 'send', {
              hitType: 'event',
              eventCategory: 'FacebookRaffle',
              eventAction: 'Social Share Draw',
              eventLabel: 'whatsapp',
            });
            cy.get('@winOpen').and('be.calledOnce');
          });
        });
      });
    });
  });
});
