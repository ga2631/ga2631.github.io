# Feature: core-algorithms-series (Basic Algorithms)

## 1. End-to-End System Flow

- **Client / Blog Data Layer:**
  - Published the 8-part foundational **Basic Algorithms** under the `code-craftsmanship-languages` track (scheduled for Thursdays / `THU`), dated to the most recent Thursday (`17/09/2026`).
  - **Standardized Evaluation Framework (Article #01):**
    - Established an abstract, hardware-independent evaluation framework rooted in the RAM Model of Computation.
    - Defined metrics: Time Complexity ($O, \Omega, \Theta$), Space Complexity (Total vs Auxiliary Space, Call Stack vs Heap allocations), Stability, In-Place execution, and Scalability Thresholds.
    - Serves as the quantitative benchmark for all subsequent algorithm articles in the series.
  - **Curated Algorithm Articles (Articles #02 - #08 with C++ Implementation & Mermaid Diagrams):**
    1. **`post-27` (`algorithmic-efficiency-metrics-time-space-complexity-big-o`):** Algorithmic Efficiency Metrics & Asymptotic Complexity Analysis (Big-O, Big-Ω, Big-Θ).
    2. **`post-28` (`bubble-sort-algorithm-mechanics-optimization-cpp`):** Bubble Sort (Adjacent element swapping, boundary shrinking, `swapped` early-exit optimization, and C++ trace).
    3. **`post-29` (`selection-sort-minimum-index-swapping-cpp`):** Selection Sort (Minimum index scanning, $O(N)$ fixed memory writes / swaps, and C++ trace).
    4. **`post-30` (`insertion-sort-adaptive-sorting-online-processing-cpp`):** Insertion Sort (Subarray shifting mechanics, linear $\Omega(N)$ adaptive sorting on nearly-sorted data, online stream ingestion, and C++ trace).
    5. **`post-31` (`linear-search-sequential-scanning-sentinel-technique-cpp`):** Linear Search (Sequential scanning, Sentinel technique eliminating loop boundary checks, cache locality, and C++ trace).
    6. **`post-32` (`binary-search-divide-and-conquer-cpp-implementation`):** Binary Search (Divide and Conquer 50% search space halving, 32-bit integer overflow mitigation, `lower_bound` extension, and C++ trace).
    7. **`post-33` (`recursion-fundamentals-call-stack-tail-call-optimization-cpp`):** Recursion (Call Stack frame lifecycle, Base Case invariants, Stack Overflow defense, Tail Call Optimization, and C++ trace).
    8. **`post-34` (`hash-table-hashing-collision-resolution-chaining-open-addressing-cpp`):** Hashing & Hash Tables (Uniform hash functions, Separate Chaining vs Open Addressing collision handling, Load Factor & dynamic Rehashing, and C++ class implementation).
  - **Strict Schema Compliance:**
    - Every article satisfies the mandatory 5 standard sections: `problem-statement`, `initial-approach`, `optimization-thinking`, `code-implementation`, `complexity-applications`.
    - Integrated valid, vector-rendered Mermaid.js diagrams illustrating state transitions, tree partitioning, and execution lifecycles.
    - Complete, clean C++ code implementations with detailed step-by-step Dry Run execution traces.
    - Semantic `<ol>` / `<li>` list structure without manual hardcoded numbers in text.
    - Bilingual parity across Vietnamese (`src/data/blog/vi/2026/09.json`) and English (`src/data/blog/en/2026/09.json`).

## 2. Technical Optimizations

- **Asymptotic Metric Anchoring:** Every algorithm article explicitly benchmarks Time and Space Complexity back to the Article #01 metrics framework.
- **Dynamic ESM & Responsive Diagrams:** All Mermaid diagrams render responsively with interactive dark mode support and full-screen Fit View pan/zoom modal integration.
- **Strict In-Place & Memory Safety:** C++ code samples emphasize reference semantics (`std::vector<int>&`), const correctness, and overflow prevention (`left + (right - left) / 2`).

## 3. Impacted Files

- `src/data/blog/vi/2026/09.json`: Complete 8-part Basic Algorithms in Vietnamese with Mermaid diagrams and C++ implementations.
- `src/data/blog/en/2026/09.json`: Complete 8-part Basic Algorithms in English with Mermaid diagrams and C++ implementations.
- `src/styles/pages/_article-modal.scss`: Responsive list indentation and nested list styles for `<ol>` and `<ul>`.
- `src/styles/base/_reset.scss`: Global list reset for `ul, ol`.
- `docs/features/core-algorithms-series.md`: Technical documentation for the Basic Algorithms.
