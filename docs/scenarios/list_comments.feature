Feature: List comments

  As an employee
  I want to see comments on a post
  So that I can learn what my colleagues also think about the post

  # Recursive content is visualized with dashes inside the tables
  Scenario: List the comments on a post
    Given there is a post like this:
      | content                                 |
      | We deployed the latest feature to prod! |
    Then the comments are listed like these:
      | comment                        | date        |
      | Hold my beer!                  | 5 hours ago |
      | -- Mine too!                   | 3 hours ago |
      | -- +1                          | 2 hours ago |
      | -- Or maybe my Raki? :)        | 1 hours ago |
      | We have to celebrate this one! | 4 hours ago |
      | -- Where is the party?         | 3 hours ago |
      | ---- At the office of course!! | 1 hour ago  |
