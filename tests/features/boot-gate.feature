@boot
Feature: Boot gate and opening shot
    A first-time visitor lands on the CRT, which waits to be woken up before it types its boot
    lines and the camera eases out to the room. Anything that skips the opening (reduced motion,
    a deep link) skips the gate with it.

    @desktop @smoke
    Scenario: The screen waits for a keypress on desktop
        Given I open the portfolio
        Then the boot screen shows "> PRESS ENTER"
        And the boot screen shows "or click the screen"
        And the footer is not visible

    @mobile
    Scenario: The screen asks for a tap on touch devices
        Given I open the portfolio
        Then the boot screen shows "> TAP TO BEGIN"
        And the boot screen does not show "or click the screen"

    @desktop @smoke
    Scenario Outline: Pressing <key> boots the machine
        Given I open the portfolio
        When I press "<key>"
        Then the boot screen types "[ SENIOR AI ENGINEER ]"
        And the boot screen types "Agents · RAG · Evals"
        And the boot screen no longer shows "> PRESS ENTER"

        Examples:
            | key   |
            | Enter |
            | Space |

    @desktop @mobile
    Scenario: Waking the screen with a click does not also open Projects
        Given I open the portfolio
        When I click the boot screen
        Then the boot screen types "[ SENIOR AI ENGINEER ]"
        And no group panel is open

    @desktop @mobile
    Scenario: The room is entered once the boot lines finish
        Given I open the portfolio
        When I wake the boot screen
        Then I eventually enter the room
        And the footer is visible

    @desktop @mobile
    Scenario: Reduced motion skips the gate and the opening shot
        Given I open the portfolio with reduced motion
        Then I eventually enter the room
        And the boot screen does not show "> PRESS ENTER"
        And the footer is visible
