# A Development Environment for building Widgets using React

# setup (samanage developer)
```sh
git clone git@github.com:SAManage/samanage-widget-kit.git
export TOKEN="<my-api-token>"
vi bin/widget-server-config.json
yarn create-widget
```

# development
```sh
rails s
yarn dev
```

then load Samanage Helpdesk in your browser and checkout your widget by opening a incident page

# submit widget for review
```sh
yarn submit-widget
```
