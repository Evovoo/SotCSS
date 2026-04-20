---
title: Physical and Data Link Layers
---

## 1. What
The physical and data link layers handle communication over a local medium. The physical layer concerns raw bit transmission over electrical, optical, or radio signals. The data link layer packages bits into frames and provides local delivery, error detection, and medium access coordination.

Core textbook topics here include framing, CRC, MAC addressing, and link-level reliability or arbitration.

## 2. Why
These layers matter because higher-level protocols assume that local transmission can move structured units of data between directly connected nodes:

- raw signals must be interpreted consistently
- receivers need frame boundaries
- transmission errors must be detected
- shared media need access control

Without these mechanisms, upper-layer addressing and transport logic would have no reliable local substrate to run on.

## 3. How
Framing determines where one data unit starts and ends. Common techniques include:

- length fields
- special flag bytes with byte stuffing
- bit-oriented delimiters with bit stuffing
- physical-layer coding conventions

CRC detects accidental transmission errors by treating the bit string as a polynomial and dividing it by a generator polynomial. The sender appends the remainder; the receiver repeats the calculation and checks whether the result is valid.

CRC sketch:

```text
data bits + zero padding
divide by generator polynomial
append remainder to frame
receiver divides full frame again
if remainder invalid:
  detect error
```

The data link layer also deals with:

- MAC addresses
- flow control on a local link
- retransmission in some protocols
- shared-medium access such as CSMA/CD or CSMA/CA

## 4. Better
CRC is better than a simple parity bit because it can detect many more common burst-error patterns. Framing by explicit length is efficient, but flag-based framing can be more robust in streaming contexts where clear delimiter recovery is important.

The physical layer and data link layer are often taught separately, but in real hardware they interact closely. Signal quality affects frame error rate, and link-layer design must account for medium characteristics such as collision domains, attenuation, and noise.

The key distinction is that the physical layer sends raw bits, while the data link layer gives those bits local structure and integrity checks.

## 5. Beyond
Modern link-layer systems also involve:

- switched Ethernet instead of shared hubs
- wireless contention and retransmission
- VLAN tagging
- link aggregation
- forward error correction in some media

The deeper lesson is that local delivery is already nontrivial. Before end-to-end networking can work, the system must reliably delimit, validate, and coordinate communication on each direct link.
