This example demonstrates how to use Opossum to implement the circuit breaker
pattern for an external API call. Here's a breakdown of what's happening:

start server a

```
ts-node src/index.ts
```

start server b

```
ts-node src/external-service.ts
```

Call the endpoint multiple times to observe the behavior

```
curl --location 'localhost:3000/api/data'
```
