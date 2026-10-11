@links
Feature: Outbound links
    Points that live somewhere else on the web carry a VISIT link. An entry inside a listing can
    point at its own destination (a repo) instead of the point's. The footer carries the contact
    links.

    Background:
        Given the visitor's local time is "10:00"
        And I am in the room

    @desktop @mobile
    Scenario Outline: The <title> point links out to <url>
        When I open the "<title>" point
        Then the reading panel has a VISIT link to "<url>"
        And the VISIT link opens in a new tab without access to this page

        Examples:
            | title                | url                                          |
            | GitHub               | https://github.com/BlaiseMoses01             |
            | My Family's Business | https://www.meltonshomeandauto.com           |
            | Blog                 | https://blaisemoses.hashnode.dev             |
            | LinkedIn             | https://www.linkedin.com/in/blaise-moses/    |
            | X                    | https://x.com/blaisephemy01                  |
            | YouTube              | https://www.youtube.com/@BlaiseM_Programming |

        @pending-deploy
        Examples: Coffee point (uncommitted in the site repo at time of writing)
            | title           | url                                    |
            | Buy Me a Coffee | https://buymeacoffee.com/blaisephemy01 |

    @desktop @mobile
    Scenario Outline: The <title> point has no VISIT link
        When I open the "<title>" point
        Then the reading panel has no VISIT link

        Examples:
            | title                 |
            | Blaise Moses          |
            | B.S. Computer Science |
            | Record Collecting     |
            | Guitar                |

    @desktop @mobile
    Scenario Outline: A repo entry links to its own repo, not the profile
        Given I have opened the "GitHub" point
        When I open the "<entry>" entry
        Then the reading panel has a VISIT link to "<url>"

        Examples:
            | entry                   | url                                                   |
            | playback-mcp            | https://github.com/BlaiseMoses01/playback-mcp         |
            | agentic-playwright-team | https://github.com/BlaiseMoses01/agentic-playwright-team |
            | chip8                   | https://github.com/BlaiseMoses01/chip8-emulator       |

    @desktop @mobile
    Scenario: Only Claude entries with a destination get a VISIT link
        Given I have opened the "Vibecoding & Agentic Things" point
        When I open the "Claude Code from Zero" entry
        Then the reading panel has a VISIT link to "https://www.youtube.com/playlist?list=PL5OZs3jMgGKQK6vsdADO5iO2hEEAjo6CP"
        When I go back to the listing
        And I open the "lofi-portfolio-build" entry
        Then the reading panel has no VISIT link

    @desktop @mobile
    Scenario: The footer carries the copyright and contact links
        Then the footer shows "Blaise Moses" with the current year
        And the footer has an email link to "mailto:bamoses2001@gmail.com"
        And the footer has a link to "https://github.com/BlaiseMoses01" labelled "github.com/BlaiseMoses01"
