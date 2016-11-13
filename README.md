# sass-v

An easier way to use CSS Custom Properties (a.k.a. CSS Variables) in SCSS!

## API

### `v($name, $default: null)` (function)
Returns the specified CSS variable, with an optional default value.

- `$name` (string) - the CSS variable name (no need to prepend `'--'`)
- `$default` (any) - the default value

```scss
.button {
  width: v(foo);
  height: v(bar, 2rem);
  font-size: v(button-font-size, v(font-size, 16px));
}

// Result:
.button {
  width: var(--foo);
  height: var(--bar, 2rem);
  font-size: var(--button-font-size, var(--font-size, 16px));
}
```

### `@include v($name, $value)`
Sets a CSS variable to the specified value.

- `$name` (string) - the CSS variable name (no need to prepend `'--'`)
- `$value` (any) - the value of the CSS variable

```scss
:root {
  @include v(font-size, 1rem);
  @include v(spacing, v(font-size, 16px));
}

// Result:
:root {
  --font-size: 1rem;
  --spacing: var(--font-size, 16px);
}
```

### `@include v($map)`
If given a map of values, each key/value combination will (recursively) set the appropriate CSS variables.

- `$map` (map) - a mapping where:
  - the `key` is the CSS variable name, and
  - the `value` is the CSS variable value, or another nested map.

```scss
:root {
  @include v((
    font-size: 1rem,
    color: (
      primary: red,
      secondary: blue,
    ),
  ));
}

// Result:
:root {
  --font-size: 1rem;
  --color-primary: red;
  --color-secondary: blue;
}
```
