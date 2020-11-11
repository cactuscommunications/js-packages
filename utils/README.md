# @cactus-tech/utils :cactus:

> Common helpful utilities for creating JS application

## Installation

```
npm install --save @cactus-tech/utils
```

## Usage

Import the main utils in the file as follows:

```
import { encodeURI } from '@cactus-tech/utils';
```

## Functions

The package includes following functions:

* **encodeURIQuery** - Loops through the query parameters and encodes it with encodeURI function.
    * Usage: `const output = encodeURIQuery({"somekey": "somevalue"})`
* **base64encodeURIComponent** - Encodes the URI with base64 strategy.
    * Usage: `const output = base64encodeURIComponent("mystring")`
* **random** - Generates random number with specified length.
    * Usage: `const output = random(10)`