 ![](http://dapaas.github.io/api-documentation/grafterizer_logo.png)
 
Grafterizer
===========

Graphical user interface for defining Grafter-based data transformation pipelines in DaPaaS.


### Development

This branch uses the [Yeoman](http://yeoman.io/) development workflow.

First, you need [Node.js](http://nodejs.org/).

Then, install grunt, bower and yeoman:
```npm install -g grunt bower yo```

Install the development dependencies:
```grunt install```

Install the application dependencies:
```bower install```

Start the development server:
```grunt serve```

### How to build

Execute ```grunt build``` to build the application. The dist folder will then be filled with the compiled files.

You can optionnaly build a [Docker](http://docker.com/) image.
```docker build -t grafterizer .```
