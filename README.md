# Liquidity One APIs

## Documentation
Documentation is available at https://docs.liquidityone.io

## OpenAPI
OpenAPI specs can be downloaded from https://docs.liquidityone.io/v3/api-docs

## Endpoints
The following endpoints are available:

| Environment | Description | URL |
| --- | --- | --- |
| Production | Documentation | https://docs.liquidityone.io |
| Production | REST | https://api.liquidityone.io |
| Production | STOMP over Websocket | wss://ws.liquidityone.io/stomp |
| Sandbox | Documentation | https://docs.test.liquidityone.io |
| Sandbox | REST | https://api.test.liquidityone.io |
| Sandbox | STOMP over Websocket | wss://ws.test.liquidityone.io/stomp |

## Code Examples
Examples of how to use the API are available in the `examples` directory.

## Support
If you have any questions, comments or feedback, please contact us via:
1. ZenDesk (ticket system): https://liquidityone.zendesk.com/
2. email: support [at] liquidityone.io


## Change Log

### 2023-08-21

#### historical-data APIs
1. rename /performance to /historical/performances ; duration must follow ISO 8601 format (valid values are P1D, P7D, P30D)
2. remove /currency/convert ; use /convert instead

#### transaction APIs
1. rename /chart to /portfolio/performance ; duration must follow ISO 8601 format (valid values are P1D, P7D, P30D and P365D)
