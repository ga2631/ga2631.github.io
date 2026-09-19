# Feature: core-algorithms-series

## 1. End-to-End System Flow
- **Client / Blog Data Layer:**
  - Published the 5-part foundational **Core Algorithms Series** under the `code-craftsmanship-languages` track (scheduled for Thursdays / `THU`), dated to the most recent Thursday (`17/09/2026`).
  - **Standardized Evaluation Framework (Article #01):**
    - Established an abstract, hardware-independent evaluation framework rooted in the RAM Model of Computation.
    - Defined metrics: Time Complexity ($O, \Omega, \Theta$), Space Complexity (Total vs Auxiliary Space, Call Stack vs Heap allocations), Stability, In-Place execution, and Scalability Thresholds.
    - Serves as the quantitative benchmark for all subsequent algorithm articles in the series.
  - **Curated Algorithm Articles:**
    1. **`post-27` (`algorithmic-efficiency-metrics-time-space-complexity-big-o`):** Algorithmic Efficiency Metrics & Asymptotic Complexity Analysis.
    2. **`post-28` (`binary-search-divide-and-conquer-optimization`):** Binary Search & Divide and Conquer Thinking (halving search space, preventing integer overflow in midpoint calculations, Database B-Tree index lookup).
    3. **`post-29` (`quicksort-partitioning-mechanics-stack-depth-analysis`):** QuickSort Deep Dive (Lomuto vs Hoare partitioning, Median-of-Three pivot selection, tail recursion stack bounding).
    4. **`post-30` (`graph-traversal-bfs-dfs-queue-stack-mechanics`):** Graph Traversal Fundamentals (BFS vs DFS, FIFO Queue vs LIFO Stack, shortest paths, cycle detection, Topological Sort).
    5. **`post-31` (`two-pointers-sliding-window-linear-time-optimization`):** Two Pointers & Sliding Window Patterns (collapsing $O(n^2)$ nested loops to linear $O(n)$, monotonicity exploitation, dynamic window invariants).
  - **Strict Schema Compliance:**
    - Every article satisfies the mandatory 5 standard sections: `problem-statement`, `initial-approach`, `optimization-thinking`, `code-implementation`, `complexity-applications`.
    - Integrated valid, vector-rendered Mermaid.js diagrams illustrating state transitions, tree partitioning, and queue/stack execution lifecycles.
    - Bilingual parity across Vietnamese (`src/data/blog/vi/2026/09.json`) and English (`src/data/blog/en/2026/09.json`).

## 2. Database & Schema Changes
- N/A (Static JSON data storage validated via `validateBlogPostStructure`).

## 3. Technical Optimizations
- **Asymptotic Metric Anchoring:** Every algorithm article explicitly benchmarks Time and Space Complexity back to the Article #01 metrics framework.
- **Dynamic ESM & Responsive Diagrams:** All Mermaid diagrams render responsively with interactive dark mode support and full-screen Fit View pan/zoom modal integration.
- **100% Contract Integrity:** Preserves eager loading via `getEagerPosts` and dynamic batch streaming via `loadNextMonthBatch`.

## 4. Impacted Files
- `src/data/blog/vi/2026/09.json`: Added 5 algorithm articles with Vietnamese technical prose and Mermaid diagrams.
- `src/data/blog/en/2026/09.json`: Added 5 algorithm articles with English technical prose and Mermaid diagrams.
- `docs/features/core-algorithms-series.md`: Technical documentation for the Core Algorithms Series.
