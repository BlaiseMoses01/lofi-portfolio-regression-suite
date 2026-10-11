@poi
Feature: Points of interest
    Clicking an object in the room zooms to it and opens a terminal-style reading panel: a path
    header, the command that "produced" the text, and the body typing in. A tap skips the typing.

    Background:
        Given the visitor's local time is "10:00"
        And I am in the room

    @desktop @mobile @smoke
    Scenario Outline: Opening the <title> point shows its panel
        When I open the "<title>" point
        Then the reading panel shows the title "<title>"
        And the reading panel path is "<path>"
        And the reading panel prompt is "<prompt>"
        When I skip the typing
        Then the reading panel body contains "<ending>"

        Examples:
            | title                        | path                     | prompt              | ending                                                      |
            | Blaise Moses                 | ~/home/me                | $ whoami            | Thanks for stopping by!                                     |
            | B.S. Computer Science        | ~/experience/degree      | $ vim degree.md     | which is something I am really proud of.                    |
            | My Family's Business         | ~/projects/car           | $ vim car.md        | lets me give back in a sense.                               |
            | Blog                         | ~/content/notebook       | $ vim notebook.md   | the occasional opinionated rambling.                        |
            | LinkedIn                     | ~/content/linkedin       | $ vim linkedin.md   | I do (usually) read messages there.                         |
            | X                            | ~/content/x              | $ vim x.md          | whatever I have just broken.                                |
            | YouTube                      | ~/content/youtube        | $ vim youtube.md    | the occasional guitar solo.                                 |
            | Record Collecting            | ~/interests/turntable    | $ vim turntable.md  | I get my best ideas on the walk to flip to Side B.          |
            | Guitar                       | ~/interests/guitar       | $ vim guitar.md     | occasionally I still rip a metal solo.                      |
            | Reading                      | ~/interests/books        | $ vim books.md      | Algorithms to Live By by Brian Christian and Tom Griffiths. |
            | Lifting                      | ~/interests/weights      | $ vim weights.md    | where my mind can't save me.                                |
            | Retro Hardware & Video Games | ~/interests/gameboy      | $ vim gameboy.md    | most people end up building a whole lot of nothing.         |

        @pending-deploy
        Examples: Coffee point (uncommitted in the site repo at time of writing)
            | title           | path           | prompt          | ending                                 |
            | Buy Me a Coffee | ~/home/coffee  | $ vim coffee.md | I'll never say no to a free coffee :)  |

    @desktop @mobile
    Scenario: Text types in and a tap completes it
        When I open the "Guitar" point
        Then the reading panel body is still typing
        When I skip the typing
        Then the reading panel body contains "occasionally I still rip a metal solo."

    @desktop @mobile
    Scenario: The back link returns from a point to its group
        Given I have opened the "Guitar" point
        When I go back to "INTERESTS"
        Then no reading panel is open
        And the group panel shows the heading "INTERESTS"

    @desktop @mobile
    Scenario: The back link on a point that belongs to no group returns to the room
        Given I have opened the "Blaise Moses" point
        When I go back to "HOME"
        Then no reading panel is open
        And no group panel is open

    @desktop
    Scenario: Clicking empty space closes the open point
        Given I have opened the "Reading" point
        When I click an empty part of the page outside the artwork
        Then no reading panel is open
        And no group panel is open

    @desktop
    Scenario: Hovering a point names it
        When I hover the "Guitar" point
        Then the "Guitar" point shows the tooltip "Guitar"

    @desktop @needs-a11y-hooks
    Scenario: Points can be reached and opened from the keyboard
        When I tab to the "Guitar" point
        And I press "Enter"
        Then the reading panel shows the title "Guitar"
