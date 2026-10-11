@sound
Feature: Sound
    Interaction sounds are on by default and the speaker in the HUD mutes them. The choice is
    remembered across visits. A visitor who never interacts never downloads the one recorded sound.

    @desktop @mobile
    Scenario: Sound is on by default
        Given I am in the room
        Then the sound button is pressed
        And the sound button is labelled "Sound on"

    @desktop
    Scenario: Muting is remembered across reloads
        Given I am in the room
        When I toggle the sound
        Then the sound button is not pressed
        And the sound button is labelled "Sound off"
        When I reload the page
        Then the sound button is labelled "Sound off"

    @desktop
    Scenario: Reduced-motion visitors start muted
        Given I open the portfolio with reduced motion
        Then the sound button is labelled "Sound off"

    @desktop
    Scenario: The voice recording is only fetched when it is needed
        Given I navigate to path "/#projects"
        Then the voice recording has not been downloaded
        When I open the "Blaise Moses" point
        Then the voice recording has been downloaded
