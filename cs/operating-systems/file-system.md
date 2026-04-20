---
title: File Systems
---

## 1. What
A file system organizes how data is named, stored, located, protected, and recovered on storage devices. It provides the abstraction of files and directories over lower-level blocks and persistence mechanisms.

Core textbook topics include file structure, directory organization, allocation methods, metadata, and inode-based indexing.

## 2. Why
File systems matter because persistent data must remain usable after process exit or machine reboot:

- applications need stable naming and lookup
- storage space must be allocated and reclaimed
- metadata must describe ownership, permissions, and layout
- crashes must not leave the system permanently inconsistent

The file system is the bridge between logical data organization and physical storage layout.

## 3. How
A file typically consists of:

- data blocks
- metadata
- directory entry mapping name to file object

In inode-based systems, the inode stores metadata such as:

- file type
- permissions
- owner
- size
- timestamps
- block pointers

Directory entries usually map a filename to an inode number rather than storing full metadata inline.

Common allocation models:

| Method | Idea | Trade-off |
| --- | --- | --- |
| contiguous | place blocks together | fast sequential access, poor growth flexibility |
| linked | each block points to next | simple growth, poor random access |
| indexed | index block or inode points to many blocks | flexible, metadata overhead |

Unix-style lookup sketch:

```text
path -> directory entries
directory entry -> inode number
inode -> block pointers
block pointers -> file data blocks
```

## 4. Better
Inodes are better than storing all metadata directly in directory entries because multiple names can point to the same underlying file object and metadata management becomes centralized.

Indexed allocation is usually better than pure linked allocation for random access, while contiguous allocation is excellent for sequential access but fragile under dynamic growth and fragmentation.

The key tension is between performance and flexibility. Sequential layout improves throughput, but dynamic update and crash resilience require more indirection and metadata.

## 5. Beyond
Modern file systems also consider:

- journaling or copy-on-write consistency
- caching and write-back policies
- extent-based allocation
- SSD-aware layout
- distributed and network file systems

The deeper lesson is that a file system is not just a directory tree. It is a consistency and allocation engine operating under performance, durability, and recovery constraints.
