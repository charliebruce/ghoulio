# Ghoulio

A docker image to automate interaction with web pages.
Uses Gecko-based [SlimerJS](https://slimerjs.org/) under the hood.

## Usage

```shell
$ docker run chetbox/ghoulio URL JAVASCRIPT
```

Opens `URL` and run `JAVASCRIPT` in the page.

`JAVASCRIPT` may make use of the following global functions:

- `close()` - Stop the process. `JAVASCRIPT` script should usually contain a call to `close()` to stop the process.
- `fail(error)` - Print out the error and stop the process.

e.g.

```shell
# Print Google search results
$ docker run chetbox/ghoulio https://www.google.com/search?q=boo "
> Array.prototype.slice.call(document.querySelectorAll('h3.r'))
> .forEach(function(a) {
>   console.log(a.textContent);
> });
> close();"
```

Any execution errors will cause the process to end. Use `try ... catch` to prevent this.

## License

Distributed under the MIT License.
