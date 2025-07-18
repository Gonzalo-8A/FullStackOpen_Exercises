# Part 0 – Diagrams

## 0.4: New note diagram

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: The user writes a note and clicks "Save"

    browser->>server: POST /new_note
    activate server
    server-->>browser: HTTP 302 Redirect to /notes
    deactivate server

    browser->>server: GET /notes
    activate server
    server-->>browser: HTML page
    deactivate server

    browser->>server: GET /main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET /main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    browser->>server: GET /data.json
    activate server
    server-->>browser: JSON array with updated notes
    deactivate server

    Note right of browser: The JavaScript code renders the updated notes to the page
```

## 0.5: Single Page App diagram

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET /spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET /main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET /main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    Note right of browser: JavaScript runs and fetches JSON data

    browser->>server: GET /data.json
    activate server
    server-->>browser: JSON array with notes
    deactivate server

    Note right of browser: JavaScript renders the notes dynamically
```

## 0.6: New note in Single Page App diagram

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: The user writes a new note and clicks "Save"

    browser->>server: POST /new_note_spa
    activate server
    server-->>browser: Response with status 201 Created
    deactivate server

    Note right of browser: JavaScript updates the DOM with the new note without reloading the page
```
