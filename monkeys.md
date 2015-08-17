Monkey testing with Gremlins.js
-------------------------------


```javascript
var s = document.createElement('script');
s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gremlins.js/0.1.0/gremlins.min.js';
document.body.appendChild(s);
```

```javascript
gremlins.createHorde()
    .gremlin(gremlins.species.formFiller())
    .gremlin(gremlins.species.clicker().clickTypes(['click']))
    .gremlin(gremlins.species.toucher())
    .gremlin(gremlins.species.scroller())
    .strategy(gremlins.strategies.distribution()
        .delay(6)
        .distribution([0.1,0.6,0.2,0.1]))
    .unleash({nb: 1000000});
````