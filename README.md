# datawrapper-orm
A database abstraction layer for Datawrapper

Usage:

Add the package to your repository using:

```
npm i --save "git+ssh://git@github.com:datawrapper/datawrapper-orm"
```

In your app you need to initialize the ORM before you can do anything else with it. It's a good idea to do this in your apps main entry point:

```js
const orm = require('datawrapper-orm');

orm.init({
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    user: '...',
    password: '...',
    database: '...'
})
```

Then you can load the models using:

```js
const {Chart,User} = require('datawrapper-orm/models');
```

Note that this will initialize the entire model, which assumes that your database user has access to all the database tables. If this is not the case you can load individual models using

```js
const User = require('datawrapper-orm/models/User');
```