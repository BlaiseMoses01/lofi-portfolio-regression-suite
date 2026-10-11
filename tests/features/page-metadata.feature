@meta
Feature: Page metadata
    What a search engine or a link preview sees.

    @desktop @smoke
    Scenario: The page describes itself
        Given I navigate to path "/"
        Then the page title is "Blaise Moses — Senior AI Engineer"
        And the page description is "Blaise Moses — Senior AI Engineer. Agents, RAG architecture, and evaluation systems, in a room you can look around."
        And the link preview title is "Blaise Moses — Senior AI Engineer"
