# Feature: core-algorithms-series (Basic & Advanced Algorithms)

## 1. End-to-End System Flow

- **Client / Blog Data Layer:**
  - Published comprehensive series under the `code-craftsmanship-languages` track (scheduled for Thursdays / `THU`), dated to the most recent Thursday (`17/09/2026`).
  - **Standardized Evaluation Framework (Article #01):**
    - Established an abstract, hardware-independent evaluation framework rooted in the RAM Model of Computation.
    - Defined metrics: Time Complexity ($O, \Omega, \Theta$), Space Complexity (Total vs Auxiliary Space, Call Stack vs Heap allocations), Stability, In-Place execution, and Scalability Thresholds.
    - Serves as the quantitative benchmark for all subsequent algorithm articles in the series.

### Part A: Foundational Basic Algorithms (`post-27` - `post-34`)
1. **`post-27` (`algorithmic-efficiency-metrics-time-space-complexity-big-o`):** Algorithmic Efficiency Metrics & Asymptotic Complexity Analysis (Big-O, Big-Ω, Big-Θ).
2. **`post-28` (`bubble-sort-algorithm-mechanics-optimization-cpp`):** Bubble Sort (Adjacent element swapping, boundary shrinking, `swapped` early-exit optimization, and C++ trace).
3. **`post-29` (`selection-sort-minimum-index-swapping-cpp`):** Selection Sort (Minimum index scanning, $O(N)$ fixed memory writes / swaps, and C++ trace).
4. **`post-30` (`insertion-sort-adaptive-sorting-online-processing-cpp`):** Insertion Sort (Subarray shifting mechanics, linear $\Omega(N)$ adaptive sorting on nearly-sorted data, online stream ingestion, and C++ trace).
5. **`post-31` (`linear-search-sequential-scanning-sentinel-technique-cpp`):** Linear Search (Sequential scanning, Sentinel technique eliminating loop boundary checks, cache locality, and C++ trace).
6. **`post-32` (`binary-search-divide-and-conquer-cpp-implementation`):** Binary Search (Divide and Conquer 50% search space halving, 32-bit integer overflow mitigation, `lower_bound` extension, and C++ trace).
7. **`post-33` (`recursion-fundamentals-call-stack-tail-call-optimization-cpp`):** Recursion (Call Stack frame lifecycle, Base Case invariants, Stack Overflow defense, Tail Call Optimization, and C++ trace).
8. **`post-34` (`hash-table-hashing-collision-resolution-chaining-open-addressing-cpp`):** Hashing & Hash Tables (Uniform hash functions, Separate Chaining vs Open Addressing collision handling, Load Factor & dynamic Rehashing, and C++ class implementation).

### Part B: Advanced Algorithms (`post-35` - `post-47`)
1. **`post-35` (`dynamic-programming-optimal-substructure-memoization-tabulation-cpp`):** Dynamic Programming (Optimal Substructure, Overlapping Subproblems, Top-Down Memoization vs Bottom-Up Tabulation, 1D space optimization, and 0/1 Knapsack in C++).
2. **`post-36` (`divide-and-conquer-strategy-master-theorem-mergesort-cpp`):** Divide and Conquer (Master Theorem, Divide-Conquer-Combine lifecycle, stable MergeSort $O(N \log N)$, and C++ trace).
3. **`post-37` (`dijkstra-shortest-path-algorithm-priority-queue-cpp`):** Dijkstra Shortest Path (Greedy invariants, Edge Relaxation, Min-Heap priority queue $O((V + E) \log V)$, and C++ path reconstruction).
4. **`post-38` (`bellman-ford-shortest-path-negative-weights-cycle-detection-cpp`):** Bellman-Ford Shortest Path (Negative edge weights, $V - 1$ relaxation passes $O(V \times E)$, negative cycle detection, and early-exit optimization).
5. **`post-39` (`floyd-warshall-all-pairs-shortest-path-matrix-dp-cpp`):** Floyd-Warshall All-Pairs Shortest Path (3-nested loop matrix DP $O(V^3)$, intermediate pivot vertex bridging, diagonal cycle checks, and path reconstruction).
6. **`post-40` (`shortest-path-algorithms-comparison-dijkstra-bellman-ford-floyd-warshall`):** Shortest Path Algorithms Comparison (Architectural comparison matrix, algorithmic trade-offs, unified benchmark harness, and engineering Decision Tree).
7. **`post-41` (`ford-fulkerson-maximum-flow-edmonds-karp-residual-graph-cpp`):** Ford-Fulkerson Maximum Flow (Max-Flow Min-Cut Theorem, Residual Graph backward cancellation, Edmonds-Karp BFS $O(V \times E^2)$, and C++ implementation).
8. **`post-42` (`dinics-algorithm-maximum-flow-level-graph-blocking-flow-cpp`):** Dinic's Maximum Flow (Layered Level Graph BFS, multi-path Blocking Flow DFS, `work[]` dead-end pruning, $O(V^2 \times E)$ and $O(E \sqrt{V})$ on unit networks).
9. **`post-43` (`maximum-flow-algorithms-comparison-ford-fulkerson-dinic`):** Maximum Flow Algorithms Comparison (Single-path augmentation vs layered blocking flow, scaling limits, and reduction to Maximum Bipartite Matching).
10. **`post-44` (`kruskals-minimum-spanning-tree-dsu-disjoint-set-union-cpp`):** Kruskal's Minimum Spanning Tree (Edge-centric greedy selection, Disjoint Set Union with Path Compression & Union by Rank $O(E \log E)$, and C++ implementation).
11. **`post-45` (`prims-minimum-spanning-tree-priority-queue-cut-property-cpp`):** Prim's Minimum Spanning Tree (Vertex-centric growth, Cut Property, Min-Heap priority queue $O((V + E) \log V)$, and C++ implementation).
12. **`post-46` (`minimum-spanning-tree-algorithms-comparison-kruskal-vs-prim`):** Minimum Spanning Tree Algorithms Comparison (Edge-Centric vs Vertex-Centric, Sparse vs Dense density boundary, Minimum Spanning Forest handling, and benchmark test suite).
13. **`post-47` (`string-pattern-matching-algorithms-kmp-rabin-karp-cpp`):** String Processing & Pattern Matching (Knuth-Morris-Pratt $O(N + M)$ with LPS prefix table without backtracking, Rabin-Karp Polynomial Rolling Hash $O(1)$ window updates, and C++ implementations).

## 2. Technical Quality Standards

- **Strict Schema Compliance:**
  - Every article satisfies the mandatory 5 standard sections: `problem-statement`, `initial-approach`, `optimization-thinking`, `code-implementation`, `complexity-applications`.
  - Integrated valid, vector-rendered Mermaid.js diagrams illustrating state transitions, tree partitioning, and execution lifecycles.
  - Complete, clean, compiling C++ code implementations with detailed step-by-step Dry Run execution traces.
  - Semantic `<ol>` / `<li>` list structure without manual hardcoded numbers in text.
  - Clean HTML without raw LaTeX artifacts (`$` signs, `\Omega`, `\Theta`, `\frac`, etc.).
  - Bilingual parity across Vietnamese (`src/data/blog/vi/2026/09.json`) and English (`src/data/blog/en/2026/09.json`).

## 3. Impacted Files

- `src/data/blog/vi/2026/09.json`: Complete 21 algorithm articles (8 Basic + 13 Advanced) in Vietnamese with Mermaid diagrams and C++ implementations.
- `src/data/blog/en/2026/09.json`: Complete 21 algorithm articles (8 Basic + 13 Advanced) in English with Mermaid diagrams and C++ implementations.
- `src/styles/pages/_article-modal.scss`: Responsive list indentation and nested list styles for `<ol>` and `<ul>`.
- `src/styles/base/_reset.scss`: Global list reset for `ul, ol`.
- `docs/features/core-algorithms-series.md`: Technical documentation for Basic & Advanced Algorithms.
