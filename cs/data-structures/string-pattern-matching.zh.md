---
title: 串与模式匹配
---

## 1. What
串结构把字符序列当作一类基础数据，而模式匹配关注的是：模式串是否出现在目标文本中，以及出现在哪里。这里的关键问题是如何避免大量重复而无效的比较。

教材中的代表算法是 KMP。它先对模式串做预处理，把“已经匹配过的前缀信息”保存下来，从而在失配时复用已有结果。

## 2. Why
字符串匹配的重要场景非常多：

- 编辑器和搜索工具
- 编译器与词法分析
- DNA 或序列分析
- 日志扫描与入侵检测

朴素匹配很好写，但一旦文本很长、模式串又存在自重叠，重复回退会变得昂贵。

## 3. How
朴素匹配在每次失配后都从下一个起点重新开始：

```text
for i from 0 to n - m:
  compare pattern[0..m-1] with text[i..i+m-1]
```

KMP 的改进在于先构造失败函数，常写作 `next` 或 `lps`：

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

匹配阶段的关键是：文本指针永不回退。

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

复杂度可概括为：

| Method | Time |
| --- | --- |
| naive matching | 最坏 `O(nm)` |
| KMP preprocessing | `O(m)` |
| KMP matching | `O(n)` |

## 4. Better
当模式串存在重复前后缀时，KMP 相比朴素匹配优势明显，因为失配恢复不再从头开始，而是利用模式本身的结构信息。

但 KMP 并不是唯一方案。Boyer-Moore 在大字符集下经常有更少的实际比较次数；Rabin-Karp 在需要用哈希批量过滤候选匹配时很有价值；如果要同时匹配很多模式，Trie 或自动机方法通常更合适。

## 5. Beyond
真实系统里的字符串处理还要考虑：

- Unicode 与变长编码
- 大小写折叠和区域相关比较
- 流式输入下文本无法整体驻留内存
- 近似匹配而不是精确匹配

字符串算法非常能体现“理论与工程结合”的特点：渐进复杂度当然重要，但编码、规范化和缓存行为同样决定最终性能。
