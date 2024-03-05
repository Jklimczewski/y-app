# :book: Y-App

## :notebook: Description

I've made this project during my last year of studies on course "Web Technologies". That was my first experience with [Vue.js](https://vuejs.org/) and I have to say I really enjoyed it.

### 🧰 Architecture

- server written in JavaScript, Node.js and connected to MongoDB Database
- client written in JavaScript, Vue.js with usage of one and only [Pinia Store](https://pinia.vuejs.org/)
- authorization with [Passport](https://www.passportjs.org/) and Passport-local strategy
- connected to [ImageKit](https://imagekit.io/) for working with profile pictures
- usage of [Socket.io](https://socket.io/) as the WebSockets protocol library to send notification to clients
- CSS styling with the help of [Tailwind](https://tailwindcss.com/)

## :star: Main features

- user register/login using email and password authentication
- update profile data and display it as a nice visiting card
- possibility to follow users, filtered before with a user searchbar, and see their page with created posts
- with the help of websockets, real-time notification about new posts from our friends
- main page containing paginated posts displayed in to ways:
  - new, unseen posts from followed users
  - all followed users posts from the last 24 hours time period
- lastly, of course, creating own posts / quoting and commenting already created ones