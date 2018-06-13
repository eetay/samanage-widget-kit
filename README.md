# A Development Environment for building Widgets using React

## Setup development environemnt for new widget

 - Fork this repository (the FORK button on top right of this page)
 - Clone the forked repository to your local disk, like so:
```sh
git clone git@github.com:<MyGithubAccount>/samanage-widget-kit.git
```
- (Local rails server only) start your rails server
- Generate an api token (if you don't already have one)
- edit ```./bin/widget-server-config.json```:
  - set 'origin' to 'https://api.samanagestage.com' (local rails server: 'http://localhost:3000')
    - Note: You must have permissions to create widgets the origin server you set
  - set 'info' to whatever widget info you want. 
    - Note: 'name' uniquely identifies your widget and cannot be changed once the widget is created

execute in command prompt:
``` sh
yarn
export TOKEN="<my-api-token>"
yarn create-widget
```

## Development

- (Local rails server) start your rails server
- Start the widget development server:
```sh
yarn dev
```

- Goto Samanage Helpdesk in your browser and checkout your widget by opening a incident page
- Edit ./index.js and other code to modify the widget; changes should apply immediatly in browser

## Submit widget for review
```sh
yarn submit-widget
```
