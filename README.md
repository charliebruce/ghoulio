# Ghoulio

A docker image to automate interaction with web pages.
Uses Gecko-based [SlimerJS](https://slimerjs.org/) under the hood.

## Usage

```shell
$ docker run chetbox/ghoulio URL CALLBACK_URL JAVASCRIPT
```

Opens `URL` and run `JAVASCRIPT` in the page. Makes a GET request to CALLBACK_URL with the result as the `response` query parameter.

`JAVASCRIPT` may make use of the following global functions:

- `resolve(data)` - Stop the process. `JAVASCRIPT` script should usually contain a call to `close()` to stop the process. Results in a callback with: `{"success": true, data: DATA}`
- `reject(error)` - Print out the error and stop the process. Results in a callback with: `{"success" false, "error": ERROR_INFO}`

e.g.

```shell
# Print Google search results
$ docker run chetbox/ghoulio https://www.google.com/search?q=boo "
> Array.prototype.slice.call(document.querySelectorAll('h3.r'))
> .forEach(function(a) {
>   console.log(a.textContent);
> });
> resolve();"
```

Any execution errors will cause the process to end. Use `try ... catch` to prevent this.

## License

Distributed under the MIT License.
