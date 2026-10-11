@theme
Feature: Day and night theme
    The room opens on the visitor's own clock: day from 07:00 until 19:00, night outside it. The
    HUD switch and the light switch on the wall both override that for the rest of the tab.
    Only the artwork for the visible theme is downloaded.

    @desktop @mobile
    Scenario Outline: At <time> the room opens in <theme>
        Given the visitor's local time is "<time>"
        When I open the portfolio with reduced motion
        Then the room is in "<theme>" mode

        Examples:
            | time  | theme |
            | 06:59 | night |
            | 07:00 | day   |
            | 18:59 | day   |
            | 19:00 | night |

    @desktop @mobile @smoke
    Scenario: The HUD switch toggles the lights
        Given the visitor's local time is "10:00"
        And I am in the room
        Then the lights switch offers "Lights off"
        When I toggle the lights from the HUD
        Then the room is in "night" mode
        And the lights switch offers "Lights on"

    @desktop
    Scenario: The light switch on the wall toggles the lights
        Given the visitor's local time is "22:00"
        And I am in the room
        When I flip the light switch on the wall
        Then the room is in "day" mode

    @desktop @mobile
    Scenario: The chosen theme lasts for the tab but not for the next visit
        Given the visitor's local time is "10:00"
        And I am in the room
        When I toggle the lights from the HUD
        And I reload the page
        Then the room is in "night" mode
        When I return in a new browser session
        Then the room is in "day" mode

    @desktop @mobile
    Scenario: Only the visible theme's artwork is downloaded
        Given the visitor's local time is "10:00"
        When I open the portfolio with reduced motion
        Then the "day" room artwork has been downloaded
        And the "night" room artwork has not been downloaded
        When I toggle the lights from the HUD
        Then the "night" room artwork has been downloaded

    @desktop @mobile
    Scenario: An open point stays open when the lights change
        Given the visitor's local time is "10:00"
        And I am in the room
        And I have opened the "Guitar" point
        When I toggle the lights from the HUD
        Then the room is in "night" mode
        And the reading panel shows the title "Guitar"
