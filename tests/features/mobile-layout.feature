@layout @mobile
Feature: Portrait and touch layout
    On a phone held upright the artwork covers the screen and is cropped at the sides, so dragging
    is how you look around. The room behind an open reading panel stops taking taps for points;
    tapping it closes the panel instead.

    Background:
        Given the visitor's local time is "10:00"
        And I open the portfolio with reduced motion

   
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
