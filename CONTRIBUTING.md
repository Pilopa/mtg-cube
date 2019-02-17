# Contributing to MTG-Cube

We would love the community to help build MTG-Cube and make it the best Magic: the Gathering Cube management tool it can be. Please follow these guidelines when contributing:

## Code of Conduct

Please read and follow the [Code of Conduct](https://github.com/Pilopa/mtg-cube/blob/master/CODE_OF_CONDUCT.md). 

## Found a bug?
If you find a bug in the source code, you can help resolving it by submitting an issue. Even better, you can submit a Pull Request with a fix.

## Missing a feature ?

You can *request* a new feature by submitting an issue to this GitHub Repository. If you would like to implement a new feature, please submit an issue with a proposal for your work first, to be sure that we can use it.

## Developer Setup

Please refer to the [Developer Documentation](https://github.com/Pilopa/mtg-cube/blob/master/docs/DEVELOPER.md) to get started.

## Submission Guidelines

### Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

### Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/Pilopa/mtg-cube/pulls) for an open or closed PR that relates to your submission. You don't want to duplicate effort.
2. Be sure that an issue describes the problem you're fixing, or documents the design for the feature you'd like to add. Discussing the design up front helps to ensure that we're ready to accept your work.
3. Fork the Pilopa/mtg-cube repo.
4. Make your changes in a new git branch:
```
git checkout -b my-fix-branch master
```
5. Implement your code changes
6. Commit your changes using a descriptive commit message that follows the commit message guidelines described in the [Developer Documentation](https://github.com/Pilopa/mtg-cube/blob/master/docs/DEVELOPER.md)
```
git commit -a
```
**Note:** the optional commit -a command line option will automatically "add" and "rm" edited files.
7. Push your branch to GitHub:
```
git push origin my-fix-branch
```
8. In GitHub, send a pull request to mtg-cube:master

Your pull request will then be peer-reviewed and changes might be suggest.

If changes get suggested then:
- Make the required updates.
- Rebase your branch and force push to your GitHub repository (this will update your Pull Request):
```
git rebase master -i
git push -f
```
That's it! Thank you for your contribution!

### After your pull request is merged
After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:
```
git push origin --delete my-fix-branch
```

- Check out the master branch:
```
git checkout master -f
```

- Delete the local branch:
```
git branch -D my-fix-branch
```

- Update your master with the latest upstream version:
```
git pull --ff upstream master
```
