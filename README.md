# sass-v

An easier way to use CSS Custom Properties (a.k.a. CSS Variables) in SCSS!

- [API - functions](#api---functions)
- [API - mixins](#api---mixins)

## API - functions

### `v($name, $default: null)`
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

### `v-calc($expression)`
An easier way to use CSS variables _and_ SCSS `$variables` in `calc(...)` expressions!

- `$expression` (list) - the expression inside `calc(...)`, as a Sass list.

In order for this to work, you need to **escape** operators: `\+, \-, \*, \/`. It's a small price to pay for greatly simplified code. See for yourself:

```scss
$foo: 3px;

.button {
  width: v-calc($foo \+ v(bar, 1rem));
}

// Result:
.button {
  width: calc(3px + var(--bar, 1rem));
}

// Compare to:
// .button {
//   width: calc(unquote('#{$foo} + var(--bar, 1rem)'));
// }
```

It also works with grouped expressions:

```scss
.button {
  width: v-calc($foo \+ (2 \* v(bar, 1rem)));
}

// Result:
.button {
  width: calc(3px + (2 * var(--bar, 1rem)));
}
```

### `v-if($condition, $value, $default)`
Similar to the Sass `if(...)` function, `v-if` returns a grouped expression that you can use inside `calc(...)`. The `$condition` needs to be:

- `1`, if truthy
- `0`, if falsey

in order for this to work. For more info, read this article: [Conditions for CSS Variables](http://kizu.ru/en/fun/conditions-for-css-variables/)

- `$condition` (string | number) - a CSS variable (or integer) that evaluates to the unitless number:
  - `1`, if truthy
  - `0`, if falsey
- `$value` (number | length | percentage) - the value if `$condition` is true
- `$default` (number | length | percentage) - the value if `$condition` is false

```scss
:root {
  --mobile: 0;
}

@media (max-width: 700px) {
  :root {
    --mobile: 1;
  }
}

.button {
  width: v-calc(v-if(v(mobile), 100%, 50%));
}

// Result:
.button {
  width: calc(var(--mobile) * 100% + (1 - var(--mobile)) * 50%);
}
```

### `v-if-not($condition, $value, $default)`
The inverse of `v-if($condition, $value, $default)`. See above.


## API - mixins

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

### `@include v-set($property, $name, $default: null)`
Sets the CSS property to the specified CSS variable (`$name`), with an optional `$default` that also works if CSS custom properties are not supported.

```scss
.button {
  @include v-set(width, foo, 5rem);
}

// Result:
.button {
  width: 5rem;
  width: v(--foo, 5rem);
}
```

### `@include v-supported`
Adds a `@supports` at-rule for conditionally applying styles if CSS custom properties are supported in the browser.

```scss
@include v-supported {
  :root {
    --foo: 16px;
  }
}

// Result:
@supports (--c: v) {
  :root {
    --foo: 16px;
  }
}
```

### `@include v-not-supported`
Adds a `@supports` at-rule for conditionally applying styles if CSS custom properties are _not_ supported in the browser.

```scss
@include v-not-supported {
  :root {
    font-size: 16px;
  }
}

// Result:
@supports not (--c: v) {
  :root {
    font-size: 16px;
  }
}
```
