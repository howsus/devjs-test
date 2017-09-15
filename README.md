# devjs-test

The app allows:
 - Create a post which has title and content.
 - Modify title and content once it's been created.
 - Leave a comment below a paricular post.
 - Modify created by you comments.
 - Delete created by you comments.
 - Delete the posts you've created.

The app is not actually secure, because anyone can change any post by switching the fingerprint, which allows the app to understand who does a post/comment belong to.
The solution of the problem  is quite simple, make posts' fingerprint invisible to anyone.

### Setting up

To get the app work:
 1) Install all dependencies - npm install
 2) change server in src/js/config.js to "http://localhost:8585" (line number 3)
 3) compile the JavaScript scripts - gulp
 4) Run the REST API server - json-server --watch db.json --port=8585 
 5) Run web-server (I used apache and I uploaded the docker file to set it up quickly) - npm run docker-up
 6) go to http://localhost 
 7) enjoy :)
