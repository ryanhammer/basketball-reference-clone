# Basketball Reference Clone

- This is intended to serve as a clone to [Basketball Reference](https://www.basketball-reference.com/). It was bootstrapped with create-remix-app.
- The frontend is using React under the hood, and Tailwind for inline CSS styling.
- Prisma is being used to create an access later to a Postgres db. The prod version of the database is being hosted at Supabase.

- Immediate ToDos:
  1. Finish adding game statistical data for the current NBA season for the months of October and November. I am using a free trial API key at Sportradar, so given the API limits and the fact that this is functionally a passion project, I am going the route of limited data to simply get some basic functionality.
  2. Use dynamic routing to create a league standings component that links to a current season page for each time
  3. Add tables with player stats for the season pages mentioned in item 2.

- There is a deployment for both the staging and main branches using Fly.io. At this point a long term goal is to keep iterating through this to practice both general app development but also build on my experience using CI/CD tools and best practices (given the less than two weeks since I saw the job posting and when the functional application deadline was, I have not exactly been engaged in good things like writing tests or refactoring much of the code).

