---
id: 83
slug: the-journey-to-rebuild-the-blog-architecture
title: '[Off-topic] Excuse the "schedule break": The journey to rebuild the blog architecture'
summary: "Announcement to temporarily pause new posts to focus on upgrading the web system from a Static Site to a Dynamic Mini-CMS with Supabase."
category: tech-radar-career-insights
publishedAt: 2026-09-30
date: 2026-09-30
readTime: 6 mins read
tags:
  - "Announcement"
  - "Architecture"
  - "Devlog"
---

Hello everyone,

Normally, according to our schedule, today we would have a new article on our familiar technical topics. However, today I'd like to ask for permission to "break the rules" and post something completely... off-topic.

This is a special announcement regarding the "engine" behind the very website you are reading. In the coming time, this blog will temporarily pause publishing new articles. The reason is not that I'm out of ideas or being lazy, but because I am preparing for a major architectural "surgery" for the entire system.

## Why this major surgery?

Since its inception, this blog has been operating as a static website (Static Site). All content is written in Markdown (`.md`) files, stored in the source code repository (Git), and automatically deployed via Github Actions.

This architecture offers excellent page load speed. But after operating for a while, it started to reveal bottlenecks in terms of developer experience:

- **Git bloat:** Stuffing `.md` files, and especially images, into Git causes the repository size to bloat unnecessarily over time.
- **Lack of flexibility:** To publish or fix a tiny typo, I have to open my laptop, fire up the IDE, edit the text, create a commit, and push it to Github. I absolutely cannot write or edit an article while sitting in a coffee shop with just a phone or tablet.

## From Static to Dynamic: The Upgrade Plan

To completely solve the above problem, I decided to transform this static system into a fully dynamic application:

1. **Migrating data to the cloud:** All article content and images will be detached from Git and moved to **Supabase** (an extremely powerful PostgreSQL-based Backend-as-a-Service platform).

2. **A "hidden" Admin panel:** I will manually build a strictly secured `/admin` module right on this domain. It will have a built-in Markdown Editor, allowing me to draft, preview, save drafts, and publish articles from any device, anywhere, without typing a single Git command.

3. **Maintaining top-tier speed:** The system will be optimized to parse content directly from the Database to the reader's interface as smoothly as possible, ensuring the speed remains as lightning-fast as the old architecture.

This migration process requires me to restructure the Database, write a script to migrate a massive amount of old data, configure Row Level Security (RLS) to protect the API, and rewrite the Frontend rendering logic. The workload is quite heavy and requires intense focus.

Therefore, I'd like to temporarily "freeze" the regular posting schedule to devote 100% of my energy to this infrastructure upgrade.

> Most likely, the first article marking the return on the new system will be a _Devlog_ dissecting every single line of code I wrote to build this Admin page and integrate Supabase.

Thank you all for your continuous support. See you in a much cooler architectural version!
