---
id: from-v1-to-v2
title: From v1 to v2
sidebar_label: From v1 to v2
slug: /migrating-v1-to-v2
---

Breaking changes for:

**Core:**

- Changed the default name assigned to stores from a number to `Rematch Store ${number}` for clarity. This could be a potential breaking change in your testing suite.
- Changed typings to avoid future issues, on v1.x types doesn't work so the change should be easy.
- Effects dispatch param can't be destructured in function Typescript (typescript design limitation).

**Plugins:**

- Removed `onInit` hook.
- Removed possibility for plugins to include any plugins in their configuration.
- Changed typings to avoid future issues.
- Persist plugin is updated to match redux-persist, so probably you'll find some errors.
