# AGENTS.md

## 1. Scope
This file governs content created or edited under `cs/`.

## 2. Directory Structure
```text
.
├── cs/
│   ├── data-structures/
│   ├── algorithms/
│   ├── operating-systems/
│   ├── networks/
│   └── AGENTS.md
```

## 3. Universal Content Structure (Standard)
All files located under `cs/` and its subdirectories, as well as tool-related documentation, must strictly follow this five-part structure:

### 3.1 Structure Definition
- **## 1. What**: Core Definition. Describes what the technology, data structure, or protocol is, and the fundamental problem it addresses.
- **## 2. Why**: Value Proposition. Explains why it should be used, its primary advantages, and typical use cases.
- **## 3. How**: Core Implementation/Workflow.
    - **For CS**: Showcase core algorithm pseudocode, logical flowcharts, or mathematical models.
    - **For Tools**: Provide installation steps and quick-start examples.
- **## 4. Better**: In-depth Comparison. Lateral comparisons with similar solutions (e.g., Quick Sort vs. Merge Sort, TCP vs. UDP), performance analysis, or optimization techniques.
- **## 5. Beyond**: Extensions and Constraints. Covers ecosystem integration, production pitfalls, or "when not to use" scenarios.

---

## 4. Computer Science (cs/) Specifics

While adhering to the **Universal Structure** above, each sub-directory should cover the following core knowledge points:

### 4.1 Data Structures (`cs/data-structures/`)
Apply the structure to topics including:
- Linear Lists (Sequential Lists, Linked Lists).
- Stacks & Queues (Circular Queues, Expression Evaluation).
- Strings & Pattern Matching (KMP).
- Trees & Binary Trees (Traversals, Threaded Binary Trees, Balanced Trees).
- Graphs (Adjacency Matrix/List, DFS/BFS).
- Hash Tables & Search Algorithms.

### 4.2 Algorithms (`cs/algorithms/`)
Apply the structure to topics including:
- Complexity Analysis (Master Theorem).
- Recursion & Divide and Conquer.
- Dynamic Programming (Knapsack Problem, Sequence Problems).
- Greedy Algorithms.
- Backtracking (N-Queens).
- Graph Algorithms (Dijkstra, Prim/Kruskal).

### 4.3 Operating Systems (`cs/operating-systems/`)
Apply the structure to topics including:
- Processes & Threads (State Transitions, Synchronization/Mutual Exclusion).
- CPU Scheduling Algorithms.
- Deadlock Handling (Banker's Algorithm).
- Memory Management (Paging/Segmentation, Virtual Memory, LRU).
- File Systems (Inodes, File Structure).
- I/O Systems (Interrupts, DMA).

### 4.4 Networks (`cs/networks/`)
Apply the structure to topics including:
- Layered Models (OSI / TCP-IP).
- Physical & Data Link Layers (CRC, Framing).
- Network Layer (IP Protocol, Routing Algorithms).
- Transport Layer (TCP Connection Management, Congestion Control, UDP).
- Application Layer (HTTP/HTTPS, DNS).

---

## 5. Tools Content Standards
In addition to the universal structure in Section 3, tool documentation must adhere to:
- **Heading Alignment**: `##` headings for the same category of tools must remain identical in English.
- **Practicality**: The `## 3. How` section must include runnable code snippets or CLI commands.

---

## 6. Editing Guidance
- **Language**: Whenever possible, provide a matching `.zh.md` translation file alongside the English source.
- **Style**: Prefer comparative and practical explanations over simple glossaries or terminology lists.
- **Stability**: Use stable kebab-case for filenames.
- **Updates**: If a topic affects bridge modes or conceptual links, update `src/lib/cs-links.ts` accordingly.