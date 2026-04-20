---
title: 图算法
---

## 1. What
图算法研究的是顶点和边构成的结构，其中核心问题通常是连通性、路径代价、生成结构或信息传播。教材里最重要的主题之一就是最短路径和最小生成树。

Dijkstra 用于带非负权的单源最短路径；Prim 和 Kruskal 都用于求最小生成树，但构造方式不同。

## 2. Why
这些算法重要，是因为图结构无处不在：

- 路由与导航
- 网络设计
- 依赖优化
- 聚类与基础设施规划

需要特别区分的是问题目标：最短路径关心的是“从某点到其他点的最便宜路线”，最小生成树关心的是“把整张图连起来的总代价最小”。

## 3. How
Dijkstra 的核心思想是反复确定当前未确定节点里距离源点最近的那个：

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

它正确成立的前提是边权非负。

Prim 的思路是从一棵连通树不断向外扩展：

```text
pick any start vertex
while tree does not contain all vertices:
  choose minimum-weight edge from tree to outside vertex
  add that vertex and edge
```

Kruskal 则是先把每个点看成独立连通分量，再逐步合并：

```text
sort edges by weight
for each edge in order:
  if its endpoints are in different components:
    add edge
    union the components
```

Kruskal 最常用的辅助结构是并查集。

## 4. Better
当边权有意义时，Dijkstra 比无权图 BFS 更合适；但它不能处理负权边，这时就需要 Bellman-Ford 等其他方法。

Prim 在稠密图或邻接矩阵场景下通常更顺手；Kruskal 在稀疏图中往往更优雅，因为只要排好边再配合并查集即可。

真正关键的区分在于目标本身：

- 最短路径优化的是从源点出发的路径代价
- 最小生成树优化的是整张图的总连通成本

二者相关，但本质并不相同。

## 5. Beyond
真实的图算法问题很快会扩展到：

- 含负权的最短路径
- 全源最短路径
- 拓扑排序
- 强连通分量
- 最大流与匹配

更广泛的结论是：图算法既依赖图的表示，也依赖问题目标。在选算法前，必须先明确优化目标是什么、图满足哪些假设条件。
