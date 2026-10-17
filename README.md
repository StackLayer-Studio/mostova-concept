# Mostova Staffing — website concept

**Concept project by [StackLayer Studio](https://github.com/StackLayer-Studio). Mostova Staffing is a fictional company; all names, numbers and contacts are samples.**

Live demo: https://stacklayer-studio.github.io/mostova-concept/

A website for a staffing agency in Polish food production, built for two very different visitors:

- **Workers** on phones and slow mobile data: a job board with live filters (city, sector, shift, contract, housing, language at work), shareable search links, and a 3-step application with validation and review.
- **Employers** on desktop: services, compliance, a "48 hours from request to first shift" timeline and a 4-step request wizard that remembers progress.

Design direction "Cold Chain": shift bars and working temperatures on every job, navy and ink with orange used only for actions, Fira Sans Extra Condensed + Golos Text (full Cyrillic).

Also: English / Ukrainian switcher, housing with an interactive district map, accessible forms (labels, live error messages, 44 px tap targets), reduced-motion support, no frameworks.

Read the [case study](CASE-STUDY.md).

Pages are generated from shared templates: `node _build/build.cjs`. Demo only — forms send no data.
