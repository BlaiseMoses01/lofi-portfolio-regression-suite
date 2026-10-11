@deeplink
Feature: Deep links
    A known group or point in the URL hash is a destination: it skips the gate and the opening
    shot and lands straight on it. Unknown hashes are ignored.

    @desktop @mobile @smoke
    Scenario: A group hash opens that group
        Given I navigate to path "/#projects"
        Then the boot screen does not show "> PRESS ENTER"
        And the group panel shows the heading "PROJECTS"

    @desktop @mobile
    Scenario: A point hash opens that point
        Given I navigate to path "/#gameboy"
        Then the reading panel shows the title "Retro Hardware & Video Games"
        And the reading panel path is "~/interests/gameboy"

    @desktop @mobile
    Scenario: An unknown hash falls back to the normal opening
        Given I navigate to path "/#not-a-real-place"
        Then no group panel is open
        And no reading panel is open

    @desktop @mobile
    Scenario: Changing the hash on a loaded page moves to the new target
        Given I navigate to path "/#projects"
        When I follow a link to "#guitar"
        Then the reading panel shows the title "Guitar"
