---
title: Graphs
---

## 1. What
Graphs model pairwise relationships among vertices. Unlike trees, graphs allow arbitrary connectivity, cycles, and multiple paths, making them suitable for networks, dependency systems, maps, and social links.

The two foundational storage choices are adjacency matrices and adjacency lists. The two foundational traversals are DFS and BFS.

## 2. Why
Graphs are used when the problem is about connections rather than just order or hierarchy:

- route planning
- dependency analysis
- recommendation and social networks
- compiler control-flow or call graphs

Their power comes from expressing structure rich enough to support reachability, shortest paths, connected components, and spanning problems.

## 3. How
Adjacency matrix:

- uses a `V x V` table
- edge lookup is `O(1)`
- space cost is `O(V^2)`
- best for dense graphs

Adjacency list:

- stores neighbors for each vertex
- space cost is `O(V + E)`
- iteration over neighbors is efficient
- best for sparse graphs

DFS emphasizes depth and is naturally recursive or stack-driven:

```text
dfs(v):
  mark v visited
  for each neighbor u of v:
    if u not visited:
      dfs(u)
```

BFS emphasizes layers and uses a queue:

```text
bfs(start):
  mark start visited
  enqueue(start)
  while queue not empty:
    v = dequeue()
    for each neighbor u of v:
      if u not visited:
        mark u visited
        enqueue(u)
```

## 4. Better
Adjacency matrices are better when:

- the graph is dense
- constant-time edge existence checks matter
- vertex count is modest and fixed

Adjacency lists are better when:

- the graph is sparse
- traversal dominates
- memory efficiency matters

DFS is good for topological reasoning, cycle detection, and structure exploration. BFS is better for unweighted shortest paths and level-by-level discovery.

## 5. Beyond
Real graph work quickly moves beyond the basics into weighted graphs, minimum spanning trees, shortest paths, SCC decomposition, and network flow.

The practical lesson is representation-driven complexity: the same abstract graph can behave very differently depending on whether the workload is lookup-heavy, traversal-heavy, sparse, dense, static, or dynamically updated.
