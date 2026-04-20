---
title: Strings and Pattern Matching
---

## 1. What
String data structures treat sequences of characters as first-class data, while pattern matching asks whether and where a pattern appears in a text. The key challenge is avoiding repeated useless comparisons.

The textbook representative is KMP, which preprocesses the pattern to reuse partial-match information after a mismatch.

## 2. Why
String matching matters in:

- editors and search tools
- compilers and lexical analysis
- DNA and sequence analysis
- log scanning and intrusion detection

Naive matching is easy to write, but its repeated backtracking can be expensive when texts are long and patterns have self-overlap.

## 3. How
Naive matching restarts pattern comparison after each mismatch:

```text
for i from 0 to n - m:
  compare pattern[0..m-1] with text[i..i+m-1]
```

KMP improves this by computing a failure function, often called `next` or `lps`:

```text
buildLPS(pattern):
  lps[0] = 0
  len = 0
  i = 1
  while i < m:
    if pattern[i] == pattern[len]:
      len = len + 1
      lps[i] = len
      i = i + 1
    else if len > 0:
      len = lps[len - 1]
    else:
      lps[i] = 0
      i = i + 1
```

During matching, KMP never moves the text pointer backward:

```text
while i < n:
  if text[i] == pattern[j]:
    i = i + 1
    j = j + 1
    if j == m: report match
  else if j > 0:
    j = lps[j - 1]
  else:
    i = i + 1
```

Complexities:

| Method | Time |
| --- | --- |
| naive matching | worst-case `O(nm)` |
| KMP preprocessing | `O(m)` |
| KMP matching | `O(n)` |

## 4. Better
KMP is better than naive matching when the pattern has repeated prefixes and suffixes, because mismatch recovery uses structure from the pattern instead of restarting from scratch.

However, KMP is not the only string-matching strategy. Boyer-Moore often performs fewer comparisons in practice on large alphabets, while Rabin-Karp is useful when hashing many candidate matches. Trie- and automaton-based approaches become attractive when many patterns must be matched simultaneously.

## 5. Beyond
Real systems must also consider:

- Unicode and variable-width encoding
- case folding and locale-sensitive comparison
- streaming input where the whole text is not resident
- approximate matching rather than exact matching

String algorithms are a good example of theory meeting engineering detail: asymptotic improvements matter, but encoding, normalization, and cache behavior decide practical performance.
