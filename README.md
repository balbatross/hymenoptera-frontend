## Hymenoptera Flow Editor

Frontend for the Hymenoptera project, you can create flows and interact with the flow engine from here

### Screenshot

![screenshot](https://raw.githubusercontent.com/balbatross/hymenoptera-frontend/master/demo.png)

### Set up

Clone the repository `https://github.com/balbatross/hymenoptera-frontend`

Install the required node modules

Run `node src/http.js`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Message passing

A node has an output object that can be configured so at runtime data can be validated and passed over links.

An autocompletion feature is provided in the editor that does deep inspection of the output format to provide easier linkage

#### Example

Output

`
{
  "result": {
    "id": "string",
    "message": "object"
  }
}
`

Input 

`
{
  "id": $it.result.id,
  "message": $it.result.message.key
}
`

### Exporting flow

With a flow open in the editor click the export button, you'll need to provide a version number each release

The exported flow will be made available in a local npm registry

![export-dialog](https://raw.githubusercontent.com/balbatross/hymenoptera-frontend/master/export-dialog.png)

