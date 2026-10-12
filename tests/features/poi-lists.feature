@lists
Feature: Points that hold a list
    Some points (the whiteboard, the octocat, the Claude plush) hold several entries. They open on
    an `ls -la` listing; picking an entry types its body in under a `vim <entry>.md` prompt.

    Background:
        Given the visitor's local time is "10:00"
        And I open the portfolio with reduced motion

    @desktop @mobile
    Scenario Outline: The <title> point opens on a listing
        When I open the "<title>" point
        Then the reading panel path is "<path>"
        And the reading panel prompt is "$ ls -la"
        And the listing has <count> entries
        And listing entry "01" is "<first>" with the summary "<summary>"

        Examples:
            | title                       | path                    | count | first                | summary                                   |
            | Experience                  | ~/experience/whiteboard | 4     | senior-ai-engineer   | Ally Financial · Jul 2026 — now           |
            | GitHub                      | ~/projects/octocat      | 3     | playback-mcp         | TypeScript · MCP · npm + Chrome Web Store |
            | Vibecoding & Agentic Things | ~/projects/claude       | 3     | lofi-portfolio-build | the site you are standing in!             |

    @desktop @mobile @smoke
    Scenario Outline: Opening the <entry> entry shows its body
        Given I have opened the "<title>" point
        When I open the "<entry>" entry
        And I skip the typing
        Then the reading panel prompt is "<prompt>"
        And the reading panel body contains "<excerpt>"

        Examples:
            | title                       | entry                 | prompt                         | excerpt                           |
            | Experience                  | model-analyst         | $ vim model-analyst.md         | built golden datasets             |
            | GitHub                      | chip8                 | $ vim chip8.md                 | No agents anywhere near this one. |
            | Vibecoding & Agentic Things | Claude Code from Zero | $ vim claude-code-from-zero.md | Free on my YouTube!               |

    @desktop @mobile
    Scenario: cd .. returns from an entry to the listing
        Given I have opened the "GitHub" point
        And I have opened the "playback-mcp" entry
        When I go back to the listing
        Then the reading panel prompt is "$ ls -la"
        And the listing has 3 entries
