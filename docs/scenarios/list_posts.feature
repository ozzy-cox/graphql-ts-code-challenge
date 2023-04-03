Feature: List posts

  As an employee
  I want to see all shared posts
  So that I can catch up with what is going on in the company

  Rule: Posts should be paginated

    Scenario: List the posts
      Given there are posts like these:
        | content | date          | comment count | thumbs up | thumbs down | rocket | heart |
        | Post 1  | 3 minutes ago | 1             | 1         | 2           | 3      | 3     |
        | Post 2  | 10 minutes    | 2             | 5         | 3           | 3      | 1     |
        | Post 3  | 15 minutes    | 5             | 10        | 4           | 3      | 8     |
        | Post 4  | 15 minutes    | 0             | 1         | 5           | 4      | 9     |
        | Post 5  | 20 minutes    | 4             | 1         | 1           | 6      | 10    |
        | Post 6  | 25 minutes    | 6             | 0         | 0           | 1      | 2     |
        | Post 7  | 26 minutes    | 12            | 2         | 0           | 10     | 4     |
        | Post 8  | 30 minutes    | 11            | 4         | 0           | 2      | 6     |
        | Post 9  | 32 minutes    | 1             | 6         | 0           | 0      | 10    |
        | Post 10 | 40 minutes    | 1             | 0         | 0           | 0      | 1     |
        | Post 11 | 45 minutes    | 3             | 0         | 0           | 0      | 1     |
        | Post 12 | 1 hour ago    | 7             | 0         | 1           | 4      | 0     |
        | Post 13 | 3 hour ago    | 8             | 1         | 2           | 6      | 0     |
      When I want to see the first page
      Then the following posts are listed:
        | content | date          | comment count | thumbs up | thumbs down | rocket | heart |
        | Post 1  | 3 minutes ago | 1             | 1         | 2           | 3      | 3     |
        | Post 2  | 10 minutes    | 2             | 5         | 3           | 3      | 1     |
        | Post 3  | 15 minutes    | 5             | 10        | 4           | 3      | 8     |
        | Post 4  | 15 minutes    | 0             | 1         | 5           | 4      | 9     |
        | Post 5  | 20 minutes    | 4             | 1         | 1           | 6      | 10    |
        | Post 6  | 25 minutes    | 6             | 0         | 0           | 1      | 2     |
        | Post 7  | 26 minutes    | 12            | 2         | 0           | 10     | 4     |
        | Post 8  | 30 minutes    | 11            | 4         | 0           | 2      | 6     |
        | Post 9  | 32 minutes    | 1             | 6         | 0           | 0      | 10    |
        | Post 10 | 40 minutes    | 1             | 0         | 0           | 0      | 1     |

