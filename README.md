<table>
        <tr>
            <td><img width="40" src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/issue-reopened.svg" alt="inviting new maintainers" /></td>
            <td><strong>Archived Repository</strong><br />
            This code is no longer maintained. If you're interested in taking over the code and its maintenance, please <a href="mailto:contact@marmelab.com?subject=Repo maintenance transfer">contact marmelab</a>.
        </td>
        </tr>
</table>

[![Build Status](https://travis-ci.org/marmelab/sedy.svg?branch=master)](https://travis-ci.org/marmelab/sedy)

# What's Sedy
Sedy is a GitHub webhook which allows pull-request reviewers to fix typos themselves by typing sed-like commands on review comments.

![commit example](./.github/sedy_commit_example.png)

### How it works
After installing Sedy on your repository, just type a sed-like command (`s/[old text]/[new text]/`) in a single comment or in a code review, and Sedy will quickly commit the fix.


# Installation

Go to [https://github.com/apps/sedy](https://github.com/apps/sedy) and follow the instructions.

That's it.

# Contributing
Whether it's for a bug or a suggestion, your feedback is precious. Feel free to [fill an issue](https://github.com/marmelab/sedy/issues/new). Be sure that it will be considered.

If you want to open a PR, all you need to know is written on the [CONTRIBUTING.md](./.github/CONTRIBUTING.md).

# License
[sedy](https://marmelab.com/sedy/) is licensed under the [MIT License](./LICENSE), and sponsored by [marmelab](https://marmelab.com).
