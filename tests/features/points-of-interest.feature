@poi
Feature: Points of interest
    Clicking an object in the room zooms to it and opens a terminal-style reading panel: a path
    header, the command that "produced" the text, and the body typing in. A tap skips the typing.

    Background:
        Given the visitor's local time is "10:00"

    @desktop @mobile @smoke
    Scenario Outline: Opening the <title> point shows its panel
        Given I open the portfolio with reduced motion
        When I open the "<title>" point
        Then the reading panel shows the title "<title>"
        And the reading panel path is "<path>"

        Examples:
            | title                        | path                |
            | Blaise Moses                 | ~/home/me           |
            | B.S. Computer Science        | ~/experience/degree |
            | My Family's Business         | ~/projects/car      |
            | Blog                         | ~/content/notebook  |
            | LinkedIn                     | ~/content/linkedin  |
            | X                            | ~/content/x         |
            | YouTube                      | ~/content/youtube   |
            | Record Collecting            | ~/interests/turntable |
            | Guitar                       | ~/interests/guitar  |
            | Reading                      | ~/interests/books   |
            | Lifting                      | ~/interests/weights |
            | Retro Hardware & Video Games | ~/interests/gameboy |

        @pending-deploy
        Examples: Coffee point (uncommitted in the site repo at time of writing)
            | title           | path          |
            | Buy Me a Coffee | ~/home/coffee |

    @desktop @mobile
    Scenario: Text types in and a tap completes it
        Given I am in the room
        When I open the "Guitar" point
        Then the reading panel prompt is "$ vim guitar.md"
        And the reading panel body is still typing
        When I skip the typing
        Then the reading panel body contains "occasionally I still rip a metal solo."

    @desktop @mobile
    Scenario: The back link returns from a point to its group
        Given I open the portfolio with reduced motion
        And I have opened the "Guitar" point
        When I go back to "INTERESTS"
        Then no reading panel is open
        And the group panel shows the heading "INTERESTS"

    @desktop @mobile
    Scenario: The back link on a point that belongs to no group returns to the room
        Given I open the portfolio with reduced motion
        And I have opened the "Blaise Moses" point
        When I go back to "HOME"
        Then no reading panel is open
        And no group panel is open

    @desktop
    Scenario: Clicking empty space closes the open point
        Given I open the portfolio with reduced motion
        And I have opened the "Reading" point
        When I click an empty part of the page outside the artwork
        Then no reading panel is open
        And no group panel is open

    @desktop @needs-a11y-hooks
    Scenario: Points can be reached and opened from the keyboard
        Given I open the portfolio with reduced motion
        When I tab to the "Guitar" point
        And I press "Enter"
        Then the reading panel shows the title "Guitar"
