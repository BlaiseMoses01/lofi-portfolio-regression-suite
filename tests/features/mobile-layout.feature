@layout @mobile
Feature: Portrait and touch layout
    On a phone held upright the artwork covers the screen and is cropped at the sides, so dragging
    is how you look around. The reading panel is a sheet across one end of the screen, and the room
    behind it stops taking taps while it is open.

    Background:
        Given the visitor's local time is "10:00"
        And I am in the room

    Scenario: The drag hint shows until the first drag
        Then I see the hint "DRAG TO LOOK AROUND"
        When I drag across the room
        Then the hint "DRAG TO LOOK AROUND" disappears

    Scenario: A drag that starts on a point does not open it
        When I drag across the room starting on the "Blaise Moses" point
        Then no reading panel is open

    Scenario: Tapping the room behind an open panel closes it
        Given I have opened the "Lifting" point
        When I tap the room behind the reading panel
        Then no reading panel is open

    Scenario: HUD buttons are comfortable touch targets
        Then the menu, sound and lights buttons are each at least 44 by 44 pixels

    Scenario Outline: The <title> point opens its panel at the <edge> of the screen
        When I open the "<title>" point
        Then the reading panel sits at the <edge> of the screen

        Examples:
            | title                        | edge   |
            | Retro Hardware & Video Games | top    |
            | Blog                         | top    |
            | Lifting                      | top    |
            | Guitar                       | bottom |
            | LinkedIn                     | bottom |
