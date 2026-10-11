@nav
Feature: Navigation menu and groups
    The hamburger menu holds five groups. Picking one frames its points in the room and shows the
    group's heading and blurb. Escape steps back one level at a time.

    Background:
        Given the visitor's local time is "10:00"
        And I open the portfolio with reduced motion

    @desktop @mobile
    Scenario: The menu opens and closes from its button
        When I open the menu
        Then the menu button is expanded
        And the menu lists "HOME, EXPERIENCE, PROJECTS, CONTENT, INTERESTS" in that order
        When I close the menu
        Then the menu button is collapsed

    @desktop @mobile
    Scenario: Clicking outside the menu closes it
        When I open the menu
        Then the menu button is expanded
        When I click outside the menu
        Then the menu button is collapsed

    @desktop @mobile @smoke
    Scenario Outline: Picking <group> from the menu shows that group
        When I open the menu
        And I choose "<group>" from the menu
        Then the menu button is collapsed
        And the group panel shows the heading "<group>"
        And the group panel shows "<blurb>"

        Examples:
            | group      | blurb                                                        |
            | EXPERIENCE | Three roles, one through-line: make the model the easy part. |
            | PROJECTS   | Things I built, shipped, and broke along the way.            |
            | CONTENT    | Where I write, post, and respond to messages.                |
            | INTERESTS  | What the room is full of when I am not working.              |

    @desktop @mobile
    Scenario: The ROOM link returns to the wide shot
        Given I have opened the "PROJECTS" group
        When I go back to "ROOM"
        Then no group panel is open
        And no reading panel is open

    @desktop
    Scenario: Choosing HOME clears the group panel
        Given I have opened the "INTERESTS" group
        When I open the menu
        And I choose "HOME" from the menu
        Then no group panel is open

    @desktop
    Scenario: Clicking the computer screen in the room opens Projects
        When I click the computer screen in the room
        Then the group panel shows the heading "PROJECTS"

    @desktop
    Scenario: Escape steps back one level at a time
        Given I have opened the "Guitar" point
        When I press "Escape"
        Then no reading panel is open
        And the group panel shows the heading "INTERESTS"
        When I press "Escape"
        Then no group panel is open
