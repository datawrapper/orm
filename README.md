# datawrapper-orm

A database abstraction layer for Datawrapper

Usage:

Add the package to your repository using:

```
npm i --save "@datawrapper/orm"
```

In your app you need to initialize the ORM before you can do anything else with it. It's a good idea to do this in your apps main entry point:

```js
const orm = require('@datawrapper/orm');

orm.init({
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    user: '...',
    password: '...',
    database: '...'
});
```

Then you can load the models using:

```js
const { Chart, User } = require('@datawrapper/orm/models');
```

Note that this will initialize the entire model, which assumes that your database user has access to all the database tables. If this is not the case you can load individual models using

```js
const User = require('@datawrapper/orm/models/User');
```

### Plugins

The ORMs functionality can be extended with plugins. This is needed, for example, when new database tables are needed. The plugin API follows the convention of plugins in [datawrapper/api](https://github.com/datawrapper/api#plugins).

A simple ORM plugin that does nothing looks like this:

```js
/* config.js */
plugins: {
    'my-orm-plugin': {
        my_name: 'Steve'
    }
}

/* orm.js */
module.exports = {
    register: async (ORM, config) => {
        console.log(`Hi I am ${config.my_name}!`)
        // logs "Hi I am Steve!" on registration
    }
}
```

There are 2 interesting properties on the `ORM` object that help with plugin access.

* `ORM.plugins` is an object with all configured plugins. They are **not** registered by default. Since standard `Models` are not defined after `ORM.init()` either, it wouldn't make sense to do that for plugins.

This is how you register a plugin:

```js
await ORM.init()
const { plugins } = ORM

const MyORMPlugin = require(plugins['my-orm-plugin'].requirePath)
await MyORMPlugin.register(ORM, plugins['my-orm-plugin'])
```

This method is very useful for tests where you only need a special plugin. There is also a helper method to register all plugins. It is in functionality similar to requiring all models with `require('@datawrapper/orm/models')`.

* `ORM.registerPlugins` will register all plugins.

```js
await ORM.init()
await ORM.registerPlugins()
```

### Development

#### Unit tests

To run the unit tests, run:

``` shell
make test
```

or to run only some tests:

``` shell
make test m='chart has*'
```

This will start a Docker container with a testing database, create tables in it, and run the unit
tests in another container.

The database container will keep running after the tests finish, so you can run `make test`
repeatedly and it will save some time by reusing the database and its tables.

When you're done developing the unit tests, or when you change database schema, you can stop the
database Docker container and delete the database using:

``` shell
make test-teardown
```
