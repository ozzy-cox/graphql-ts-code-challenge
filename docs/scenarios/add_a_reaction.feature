Feature: Add a reaction

  As an employee
  I want to react to posts or comments
  So that my colleagues can understand my feelings on the content

  Rule: Reactions can be a thumbs up, thumbs down, rocket or heart.
    Scenario: Adding a reaction to a post
      Given there are posts with reactions like these:
        | Post                              | Thumbs Up | Thumbs Down | Rocket | Heart |
        | What a good day                   | 2         | 0           | 1      | 0     |
        | The new feature deployed to prod! | 5         | 0           | 5      | 5     |
      When I react to the second post with heart
      Then the posts look like these:
        | Post                              | Thumbs Up | Thumbs Down | Rocket | Heart |
        | What a good day                   | 2         | 0           | 1      | 0     |
        | The new feature deployed to prod! | 5         | 0           | 5      | 6     |

    Scenario: Adding a reaction to a comment
      Given there are comments with reactions like these:
        | Comment     | Thumbs Up | Thumbs Down | Rocket | Heart |
        | Yey         | 0         | 0           | 0      | 0     |
        | Good catch! | 0         | 0           | 0      | 0     |
      When I react to the first comment with a thumbs down
      Then the comments look like these:
        | Post        | Thumbs Up | Thumbs Down | Rocket | Heart |
        | Yey         | 0         | 1           | 0      | 0     |
        | Good catch! | 0         | 0           | 0      | 0     |
