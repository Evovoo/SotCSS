---
title: Hash Table
---

## 1. What
Hash tables store key-value pairs by mapping keys through a hash function into bucket locations. The goal is near-constant-time lookup under typical conditions.

The hard part is not the abstract idea, but collision handling, load management, and making the hash distribution sufficiently uniform.

## 2. Why
Hash tables are dominant when the workload emphasizes exact-match lookup:

- dictionaries and maps
- caches
- symbol tables
- deduplication and membership tests

They are often the fastest practical general-purpose structure for insert/find/delete when ordering is not required.

## 3. How
Two classic collision strategies are separate chaining and open addressing.

Separate chaining:

```text
insert(key, value):
  i = hash(key) mod capacity
  search bucket i
  update if key exists
  otherwise append new node to bucket list
```

Open addressing with linear probing:

```text
find_slot(key):
  i = hash(key) mod capacity
  while table[i] occupied and table[i].key != key:
    i = (i + 1) mod capacity
  return i
```

When the load factor becomes too high, resize and rehash:

```text
if size / capacity > threshold:
  allocate larger table
  reinsert all entries
```

Expected average complexity is `O(1)` for search, insert, and delete, but worst-case behavior can degrade to `O(n)` when collisions cluster badly.

## 4. Better
Compared with balanced trees, hash tables usually win on exact lookup latency but lose ordered iteration, predecessor queries, and range search.

Separate chaining tolerates higher load factors and simpler deletion, while open addressing improves locality and avoids pointer-heavy bucket nodes. The better choice depends on cache behavior, allocator cost, and deletion patterns.

The hash function quality matters as much as the table scheme. A weak hash can destroy the expected complexity of an otherwise good design.

## 5. Beyond
Modern systems also care about:

- adversarial collision attacks
- concurrent resizing
- tombstones in open addressing
- incremental rehashing to avoid long pauses

Hash tables are a prime example of average-case design. They are excellent default tools, but only when exact-match lookup is really the problem and ordering is genuinely unnecessary.
