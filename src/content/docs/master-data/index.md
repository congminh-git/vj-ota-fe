# Master Data API

```
This API endpoint provides a collection of frequently used reference data, often referred to 
as "Master Data," which is relatively static. This data is essential for various lookups and 
operations across the system.
```

## Endpoint Details

### Retrieve All Master Data

**Purpose:** To fetch a complete set of non-volatile reference data (agencies, airports, currencies, etc.) in a single request.

- **Method:** `GET`
- **Path:** `/masterData`

### Response Body

The response is a JSON object containing arrays for each category of master data.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `agencies` | `Array` | List of agencies. |
| `airports` | `Array` | List of all supported airports |
| `currencies` | `Array` | List of supported currency codes and details. |
| `countries` | `Array` | List of all country codes and names. |
| `cabinClasses` | `Array` | List of supported cabin classes |
| `cityPairs` | `Array` | List of valid origin and destination airport city pairs. |

**Example Response (Structure):**

```json
{
    "agencies": [
        // ... agency objects ...
    ],
    "airports": [
        // ... airport objects ...
    ],
    "currencies": [
        // ... currency objects ...
    ],
    "countries": [
        // ... country objects ...
    ],
    "cabinClasses": [
        // ... cabinClass objects ...
    ],
    "cityPairs": [
        // ... city pair objects ...
    ]
}
```
