# API Specification

## I. Overview
```
- Architectural styles: RESTful API
- Support  JSON format for requests and responses
- Optional parameters for API methods can be included in the HTTP query string, if not part of the path.
- Secure API methods require Basic or Bearer authentication schemes over a secure channel (e.g., HTTPS).
- HTTP Methods 
  Use the appropriate HTTP method for the desired operation:
  - GET: Retrieve resources.
  - POST: Create new resources.
  - PUT or PATCH: Update resources.
  - DELETE: Remove resources.
- The API responds with standard HTTP status codes (e.g., 200 OK, 404 Not Found, 201 Created)
```

## API endpoint
```
https://34.144.235.95.nip.io/flight
```

## Sample Code
**Postman**
{% download
  title="APIGW OTA Postman Collection"
  file="/downloads/APIGW_OTA_postman.json"
  size="584 KB"
/%}
**Swagger**
{% download
  title="APIGW Swagger Collection"
  file="/downloads/APIGW_OTA_swagger.yaml"
  size="203 KB"
/%}
