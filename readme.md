## Getting Started

### Cloning the repo

```sh
bun create blank ./NAME_HERE
```

### Execute a file (eg. src/index.js)
    
```sh
bun run ./src/index.js
```

PUSHING AN UPDATE TO PRODUCTION

1. push your update to staging to verify the updates

Direction

Create a your branch and push to it (your branch). Then git checkout to “develop” (the staging environment), then pull from your branch and merge it in the develop branch, then push it inside the “develop” branch. This will get your staging environment ready to test to make sure you are not breaking anything..

2. run git tag to check the last prod tag. e.g prod-0.0.83

Direction

use the commad "git tag"

Scroll to the last of it to see the last push tag. At the time of writing this, the last is stage-file3. Yours will be “stage-file4” or any tag you wish to use 

3. run git log to copy the commit-hash of the update you pushed

Direction

use this command "git log"

Copy the commit hash of the last prod tag

4. run git tag prod-0.0.84 -m "tag message" commit-hash to create a tag

Direction

Use this command "git tag prod-0.0.84 -m "tag message" commit-hash"

Run your prod tag with a commit message and the commit hash you copied

5. run git push origin tag-name to push the tag to git, tag-name is the lastest tag you created i.e prod-0.084

Direction

Push to product by using this command "git push origin tag-name"

E.g     git push origin stage-file4


Note

There's a CI & CD that will be run in the Actions tab for staging after that, when it deploys successfully then you can now push that update to prod.

check the github repo and click on the "Actions" tab