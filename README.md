# A Development Environment for building Widgets using React

## Setup (local rails server)

```sh
git clone git@github.com:SAManage/samanage-widget-kit.git
```

- start your rails server
- make sure you are ninja on your local rails server
- issue yourself a api token if you don't already have one
- edit ```./bin/widget-server-config.json``` and setup 'origin' to your rails server and 'info' to whatever widget info you want

``` sh
yarn
export TOKEN="<my-api-token>"
yarn create-widget
```

## Development

- start your rails server

```sh
yarn dev
```

then load Samanage Helpdesk in your browser and checkout your widget by opening a incident page

## Submit widget for review
```sh
yarn submit-widget
```
