WQL
===
Query the web with SQL like syntax

## Installation
`npm i @nire0510/wql`

## Usage
```javascript
import wql from '@nire0510/wql';
// or: const wql = require('@nire0510/wql');

(async () => {
  const response = await wql(`SELECT attr(src) FROM "https://www.google.com" WHERE selector = "img";`/*, options */);

  console.log(JSON.stringify(response, null, 2));
})();
```

## Options
You can send an options object to the `wql` functions. None of its properties is mandatory:
```javascript
const response = await wql(`SELECT text FROM "https://www.google.com";`, {
  headless: true            /* BOOLEAN (default true): Indicates whether it should run in headless mode (hidden browser) */,
  turbo: false              /* BOOLEAN (default false): Indicates whether it should run in turbo mode (avoids image, stylesheets & fonts download) */,
  screenshot: false         /* BOOLEAN (default false): Indicates whether a screenshot should be taken */,
  userDataDir: string       /* STRING: Path to a User Data Directory */,
  executablePath: string    /* STRING: Path to a browser executable to run instead of the bundled Chromium */,
  viewport: {
    height: 600             /* NUMBER (default 720): Page height in pixels */,
    width: 1000             /* NUMBER (default 1080): Page width in pixels */,
  },
  wait: options.wait        /* STRING (default 'networkidle2'. Options: 'domcontentloaded', 'networkidle0', 'networkidle2', selector): The event to wait for before running the query */,
};
```

## Syntax
``` sql
SELECT [DISTINCT] property [AS alias]
  [, property [AS alias], ...]
FROM url
  [, url, ...]
[WHERE condition
  [AND|OR condition, ...]]
[ORDER BY property [DESC]
  [, property [DESC], ...]]
[LIMIT max_rows];
```

### SELECT
``` sql
SELECT text,                  -- text content
  html,                       -- outer HTML
  tag,                        -- tag name
  data(fullname) AS fullname, -- dataset attribute value
  attr(id) AS id,             -- attribute value
  style(fontSize) AS fontSize -- style property value
```

### FROM
``` sql
FROM "https://www.google.com",
  "https://www.example.com"
```

### WHERE
``` sql
WHERE selector = ".article p"
  AND text = 'test'
WHERE text != 'test'
WHERE text LIKE '%test'
WHERE text LIKE '%test%'
WHERE attr(id) LIKE 'test%'
WHERE width <= 10
WHERE width > 10 AND width < 15
WHERE width BETWEEN 10 AND 15
WHERE width IN (1, 2, 3)
```

### ORDER BY
``` sql
ORDER BY text
ORDER BY fontSize DESC
```

### LIMIT
``` sql
LIMIT 10
```

## Examples

```javascript
import wql from '@nire0510/wql';
// or: const wql = require('@nire0510/wql');

(async () => {
  // Get all images URL:
  const images = await wql(`SELECT attr(src) FROM "https://www.google.com" WHERE selector = "img";`);
  // Get all headers font-size, sorted by descending size:
  const headers = await wql(`SELECT style(fontSize) AS fontSize FROM "https://www.google.com" WHERE selector IN ("h1", "h2", "h3", "h4", "h5", "h6") ORDER by fontSize DESC;`);

  console.log(images);
  console.log(headers);
})();
```
