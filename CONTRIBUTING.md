# Contributing

Thanks for your interest in contributing! Keep the following in mind before submitting a pull request.

## Testing

Use [Jest](https://github.com/facebook/jest) to add some tests when adding new functionality.

## Documentation

When adding new functionality, add documentation using [TSDoc](https://github.com/microsoft/tsdoc).

## Versioning

When adding new features or fixing bugs, the package version needs to be bumped. Use [Changesets](https://github.com/changesets/changesets) to do this. Not every change requires a changeset.

To create a new changeset, run `pnpm changeset`. This will run the Changesets CLI, prompting you for details about the change. You’ll be able to edit the file after it’s created — don’t worry about getting everything perfect up front.

Even though you can technically use any markdown formatting you like, headings should be avoided since each changeset will ultimately be nested within a bullet list. Instead, bold text should be used as section headings.

If your PR is making changes to an area that already has a changeset, you should update the existing changeset in your PR rather than creating a new one.

## Submitting a pull request

When you're ready to submit a pull request, you can follow these naming conventions:

- Pull request titles use the [Imperative Mood](https://en.wikipedia.org/wiki/Imperative_mood) (e.g., `Add something`, `Fix something`).
- [Changesets](#versioning) use past tense verbs (e.g., `Added something`, `Fixed something`).

When you submit a pull request, GitHub will automatically lint, build, and test your changes. If you see an ❌, it's most likely a bug in your code. Please, inspect the logs through the GitHub UI to find the cause.

## Releasing

The first time a PR with a changeset is merged after a release, a new PR will automatically be created called `Version packages`. Any subsequent PRs with changesets will automatically update this existing version packages PR. Merging this PR triggers the release process by publishing to npm and cleaning up the changeset files.

<div align="right">
  <a href="#contributing">&uarr; back to top</a></b>
</div>
