---
title: Graph Algorithms
---

## 1. What
Graph algorithms solve problems over vertices and edges, where the main concern is connectivity, path cost, spanning structure, or flow of information. Among the most important textbook topics are shortest paths and minimum spanning trees.

Dijkstra targets single-source shortest paths with nonnegative edge weights. Prim and Kruskal both solve the minimum spanning tree problem, but they build the tree in different ways.

## 2. Why
These algorithms matter because graph structure appears everywhere:

- routing and navigation
- network design
- dependency optimization
- clustering and infrastructure planning

The important distinction is problem type: shortest path asks for cheapest routes, while minimum spanning tree asks for cheapest overall connectivity.

## 3. How
Dijkstra repeatedly finalizes the currently nearest unsettled vertex:

```text
dist[source] = 0
push source into priority queue
while queue not empty:
  v = extract minimum
  for each edge (v, u, w):
    if dist[v] + w < dist[u]:
      dist[u] = dist[v] + w
      update queue
```

Its correctness depends on nonnegative edge weights.

Prim grows one connected tree outward:

```text
pick any start vertex
while tree does not contain all vertices:
  choose minimum-weight edge from tree to outside vertex
  add that vertex and edge
```

Kruskal grows a forest and merges components:

```text
sort edges by weight
for each edge in order:
  if its endpoints are in different components:
    add edge
    union the components
```

Union-Find is the standard support structure for Kruskal.

## 4. Better
Dijkstra is better than unweighted BFS when edge weights matter, but it fails with negative weights. In those cases, Bellman-Ford or other methods are required.

Prim is often convenient on dense graphs or adjacency-matrix settings. Kruskal is often elegant on sparse graphs where sorting edges and using Union-Find is efficient.

The crucial comparison is conceptual:

- shortest path optimizes route cost from a source
- MST optimizes total connection cost of the whole graph

These are related but fundamentally different goals.

## 5. Beyond
Real graph algorithm work extends quickly into:

- negative-weight shortest paths
- all-pairs shortest paths
- topological sorting
- strongly connected components
- maximum flow and matching

The broader lesson is that graph problems are representation-sensitive and objective-sensitive. Before choosing an algorithm, you must be precise about what is being optimized and what assumptions the graph satisfies.
