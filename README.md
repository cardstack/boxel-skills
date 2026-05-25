# Boxel Skills

## Development

To develop core boxel skills, first install the [Boxel CLI](https://www.npmjs.com/package/@cardstack/boxel-cli):

    npm install -g @cardstack/boxel-cli

And checkout this repository

    git clone git@github.com:cardstack/boxel-skills.git

First create a branch for your new work, on the CLI or in VSCode/Cursor 

    git checkout -b my-change

In this directory, push these files to one of your workspaces

    MATRIX_URL=https://matrix.boxel.ai MATRIX_USERNAME=... MATRIX_PASSWORD=... workspace-push . https://app.boxel.ai/myuser/myworkspace

Make your changes, test things out in boxel and then pull the changed work back

    MATRIX_URL=https://matrix.boxel.ai MATRIX_USERNAME=... MATRIX_PASSWORD=... workspace-pull https://app.boxel.ai/myuser/myworkspace . 

Add and commit any changes

    git add  *
    git commit -m "change message"
    git push --set-upstream origin my-change


You can then raise a PR on github. Merged changes will go to staging, and tagged releases will go to production.
