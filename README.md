wql-cli
=======
Query the web with SQL like syntax from your terminal

## Installation

`npm i -g @nire0510/wql-cli`

## Usage

`> wql '{query}'`  
For example:  
`> wql 'SELECT text from "https://www.google.com"'`  
* URLs in the `FROM` clause must be wrapped in parentheses, e.g. "https://www.google.com".
* Method arguments (i.e. attr, data & style) must be wrapped in parentheses, e.g. attr("id").
* For more information about the query syntax, please visit [@nire0510/wql](https://www.npmjs.com/package/@nire0510/wql#syntax) npm package homepage.

### Running on Linux Server
1. Install Chromium browser:  
   `sudo apt-get install chromium-browser`
1. Call `wql` with the `--executablePath` option:  
   `wql -ep '/usr/bin/chromium-browser' 'SELECT...'`

## Help

`> wql --help`
