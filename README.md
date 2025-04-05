# HeLog-Editor

HeLog-Editor is the HeLog blog's editor built with React. Allows authenticate users to write, edit, and publish posts. Hosted on Vercel.

![website screenshots](https://i.imgur.com/PzBScv3.png)

## Links

- Live Demo: [https://helog-editor.whitesgr03.me](https://helog-editor.whitesgr03.me)
- Backend Repository: [https://github.com/whitesgr03/helog-editor](https://github.com/whitesgr03/helog-editor)

## Features:

- Google and Facebook social authentication.
- Post any content and images.
- Responsive design for mobile devices.

## Usage:

You can edit your posts on the [Live Demo](https://helog-editor.whitesgr03.me) through your web browser.

<details>

- When a user access the HeLog-Editor, if they have not authenticated, they will be forced to navigate to login page and they will need to create a username for the first login.

  <img src="https://i.imgur.com/wbg9E6S.png" alt="login page"/>
  <img src="https://i.imgur.com/t71KYJN.png" alt="new user set username"/>

- View all of your posts.
  <img src="https://i.imgur.com/sQuAtCM.png" alt="dashboard">

- Create a new post using a template.
  <img src="https://i.imgur.com/yFl8rRG.png" alt="create a new post">

- Edit the specified post.
  <img src="https://i.imgur.com/QkDyQ8U.png" alt="update the specified post">

- Delete the specified post.  
  <img src="https://i.imgur.com/o4lqZ0i.png" alt="delete the specified post">

</details>

## Technologies:

1. [React Router](https://reactrouter.com/) to keep the user interface in sync with the URL. In addition, it allows defining which component to display for a specified URL.

2. [Yup](https://github.com/jquense/yup) to validate any form's data and make sure that it matches the schemas that define how the data should look and the values expected to conform to them.

3. [tinyMCE](https://www.tiny.cloud/) is used to create any content and images in the post.

## Additional info:

- This project consists of a backend for API and two different front-ends for accessing and editing blog posts.

- The backend's authentication is cookie-based to prevent the need to log in again when switching between two different front-ends.
