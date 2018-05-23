# A Development Environment for building Widgets using React

## setup (local rails server)

```sh
git clone git@github.com:SAManage/samanage-widget-kit.git
export TOKEN="<my-api-token>"
```

edit ```./bin/widget-server-config.json```
start your rails server
make sure you are ninja on your local rails server

``` sh
yarn
yarn create-widget
```

## development

start your rails server

```sh
yarn dev
```

then load Samanage Helpdesk in your browser and checkout your widget by opening a incident page

## submit widget for review
```sh
yarn submit-widget
```
