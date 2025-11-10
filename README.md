# HeLog-Editor

HeLog-Editor is the HeLog blog's editor built with React. Allows authenticate users to write, edit, and publish posts. Hosted on Vercel.

![website screenshots](https://i.imgur.com/PzBScv3.png)

## Links

- Live Demo: [https://helog-editor.whitesgr03.me](https://helog-editor.whitesgr03.me)
- Backend Repository: [https://github.com/whitesgr03/helog-editor](https://github.com/whitesgr03/helog-editor)

## Features:

- Google and Facebook social authentication.
- Post any content and images.
- Comment on any post.
- Responsive design for mobile devices.

## Usage:

You can edit your posts on the [Live Demo](https://helog-editor.whitesgr03.me) through your web browser.

<details>

- When a user access the HeLog-Editor, if they have not authenticated, they will be forced to navigate to login page and they will need to create a username for the first login.

  <img src="https://i.meee.com.tw/RSj66oD.png" alt="login page"/>

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

1. [Tanstack Query(react query)](https://tanstack.com/query/latest) to data fetching, caching and updating server state. Instead of using React Effect to data fetching.

2. [React Context](https://react.dev/learn/passing-data-deeply-with-context) to sharing App component data deeply thought the tree and preventing rerender all components when the state of app component is changed.

3. [React Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) to extract the all the state logic of context and preventing rerender the event handles of context when state of context is changed.

4. [Typescript](https://www.typescriptlang.org/) used to save considerable amounts time in validating that project have not accidentally broken.

5. [React Router](https://reactrouter.com/) to keep the user interface in sync with the URL. In addition, it allows defining which component to display for a specified URL.

6. [Yup](https://github.com/jquense/yup) to validate any form's data and make sure that it matches the schemas that define how the data should look and the values expected to conform to them.

7. [tinyMCE](https://www.tiny.cloud/) used to view all posts created by users and create any content and images in the post.

## Additional info:

- This project consists of a backend for API and two different front-ends for accessing and editing blog posts.

- The backend's authentication is cookie-based to prevent the need to log in again when switching between two different front-ends.

## Source folder structure

```
src/
│
├─── assets/                            # Static assets (icons, images)
│
├─── components/                        # ach React component is placed in a folder with its associated CSS modules and tests
│     ├── layout/
│     │    ├── Footer/
│     │    │    └── Footer.tsx
│     │    └── Header/
│     │         ├── Dropdown.tsx
│     │         └── Header.tsx
│     ├── pages/
│     │    ├── App/
│     │    │    ├── Alert.tsx
│     │    │    ├── App.tsx
│     │    │    ├── CreateUsername.tsx
│     │    │    └── Modal.tsx
│     │    ├── Dashboard/
│     │    │    ├── Dashboard.tsx
│     │    │    ├── DeletePostModel.tsx
│     │    │    └── TableRows.tsx
│     │    ├── Home/
│     │    │    └── Home.tsx
│     │    └──── Post/
│     │         ├── PossMainImageUpdate.tsx
│     │         ├── PostEditorCreate.tsx
│     │         └── PostEditorUpdate.tsx
│     │
│     └── utils/
│          ├── Error/
│          │    ├── Error.tsx
│          │    └── NotFound.tsx
│          └── Loading.tsx
│
├─── styles/                            # Generic CSS Modules
│     ├── button.module.css
│     ├── form.module.css
│     ├── image.module.css
│     └── index.css                     # Index CSS include main custom properties and type selectors styles
│
├─── utils/                             # Generic function
│     ├── handleFetch.ts
│     ├── handlePost.ts                 # Handle post API
│     ├── handleUser.ts                 # Handle user info API
│     ├── queryOptions.ts               # Handle react query caching and fetching options
│     └── verifySchema.ts               # Handle yup package validation values.
│
├─── E2E/                               # handle end-to-end testing
│
├─── main.tsx
└──  Router.tsx                         # React router config
```
