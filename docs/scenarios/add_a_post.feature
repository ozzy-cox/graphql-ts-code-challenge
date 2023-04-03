Feature: Add a post

  As an employee
  I want to add a new post to platform
  So that my colleagues can know what are the news on my side

  Rule: A post can be a maximum 280 characters

    Example: Less than 281 characters
      Given I want to say to my colleagues "Today is my birthday!"
      When I add a new post
      Then the post looks like this:
        | content              | date             |
        | Today is my birthday | The current date |

    Example: More than 280 characters
      Given I want to share a very long content with my colleagues
      When I try to send this post
      Then I see the error that says "You cannot send a post which has more than 280 characters"
