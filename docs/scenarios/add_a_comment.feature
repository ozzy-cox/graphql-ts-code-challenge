Feature: Add a comment

  As an employee
  I want to add a comment on a post or an another comment
  So that I can share my thoughts with my colleagues

  Rule: A comment can be a maximum 280 characters

    Example: Add to a post -- Less than 281 characters
      Given there is a post like this:
        | content              |
        | Today is my birthday |
      And there are comments on this post like these:
        | comment                 | date        |
        | We should eat a cake!   | 3 hours ago |
        | When is the party then? | 2 hours ago |
      And I want to say "Happy birthday"
      When I send the comment
      Then the post comments look like these:
        | comment                 | date        |
        | We should eat a cake!   | 3 hours ago |
        | When is the party then? | 2 hours ago |
        | Happy birthday!         | now         |

    # Recursive content is visualized with dashes inside the tables
    Example: Add to a comment - Less than 281 characters
      Given there are comments like these:
        | comment                          | date        |
        | Nice to hear that!               | 5 hours ago |
        | -- Yes me too!                   | 3 hours ago |
        | ---- Same here!                  | 2 hours ago |
        | ---- +1                          | 1 hour ago  |
        | You deserved this!               | 4 hours ago |
        | -- Definitely she deserved this! | 3 hours ago |
      And I want to say "She is the best" to "You deserved this!" comment
      Then the comment list looks like these:
        | comment                          | date        |
        | Nice to hear that!               | 5 hours ago |
        | -- Yes me too!                   | 3 hours ago |
        | ---- Same here!                  | 2 hours ago |
        | ---- +1                          | 1 hour ago  |
        | You deserved this!               | 4 hours ago |
        | -- Definitely she deserved this! | 3 hours ago |
        | -- She is the best               | now         |

    Example: More than 280 characters
      Given I want to leave a comment with a very long content
      When I try to send this comment
      Then I see the error that says "You cannot send a comment which has more than 280 characters"

