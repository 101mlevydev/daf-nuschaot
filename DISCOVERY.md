# DISCOVERY — דף נוסחאות (Daf Nuschaot) · Product & UX/UI

> **How to use this doc.** Product-vision & UX/UI questions only (no tech). Each has my
> **Recommendation + why**, and an **Answer** slot — confirm ("✅") or redirect. Unanswered =
> agreed with the recommendation. Your answers drive the deep design/spec pass.

**The app in one line:** drag curated formulas onto an A4 page, arrange them, export a crisp
print-ready *daf nuschaot*. **Emotional target: relief.** **Context: laptop, exam week, focused.**

---

## A. Vision & positioning

🎯 *Changes:* the core promise and what we deliberately leave out.

**QA.1 — The one-liner / promise?**
- *Recommendation:* "Build the perfect exam formula sheet in five minutes, not five hours." —
  *why:* speed + the concrete artifact is the whole pitch.
- **Answer:** ▮

**QA.2 — What is it explicitly NOT?**
- *Recommendation:* Not a note-taking app, not a study/learning tool, not a LaTeX editor — it's a
  **layout + curation + export** tool. — *why:* scope discipline keeps the demo tight.
- **Answer:** ▮

**QA.3 — The wedge / unfair advantage vs "just use Word"?**
- *Recommendation:* **A pre-curated, course-specific formula library + instant clean A4 export.**
  — *why:* removes both the hunting and the layout pain in one move.
- **Answer:** ▮

---

## B. User & context

🎯 *Changes:* density, default course, desktop-vs-tablet priority.

**QB.1 — When exactly is it used: night-before cramming, or across the semester?**
- *Recommendation:* **Optimize for night-before** (fast, low-friction, forgiving), still usable
  earlier. — *why:* peak need = peak emotional payoff for the demo.
- **Answer:** ▮

**QB.2 — Will students mostly start from scratch, or expect a head-start template?**
- *Recommendation:* **Offer a per-course starter sheet they can prune** + a blank option. —
  *why:* a populated page is a faster "wow" and reduces blank-canvas paralysis.
- **Answer:** ▮

**QB.3 — Tablet/stylus use a priority, or laptop+mouse only?**
- *Recommendation:* **Laptop+mouse first; tablet touch as a nice-to-have**, no stylus features. —
  *why:* canvas precision is easiest with a pointer; stylus is scope creep.
- **Answer:** ▮

---

## C. The magic moment

🎯 *Changes:* where we spend the polish budget.

**QC.1 — The single aha — is it the *library* ("they already have my formulas!") or the *export*
("a real PDF!")?**
- *Recommendation:* **The export is the climax; the library is the hook.** Make export feel
  ceremonial. — *why:* the tangible deliverable is what judges and students remember.
- **Answer:** ▮

**QC.2 — First 10 seconds: what should a new user see/do?**
- *Recommendation:* **A blank A4 already on screen + a course picker glowing** — drag one formula
  within 10s. — *why:* zero setup friction; immediate progress.
- **Answer:** ▮

**QC.3 — Should export have a moment of delight (preview reveal, subtle celebration), or stay
strictly utilitarian?**
- *Recommendation:* **A short, satisfying preview-reveal** ("הנה הדף שלך") before the
  print/download. — *why:* turns a file dialog into a payoff without being gimmicky.
- **Answer:** ▮

---

## D. Journey, screen by screen

🎯 *Changes:* number of screens, navigation model.

**QD.1 — One single workspace, or multi-step (pick course → build → export)?**
- *Recommendation:* **One workspace**: library panel + A4 canvas + a top toolbar; course is a
  filter, not a separate screen. — *why:* keeps the user in flow; fewer screens = faster.
- **Answer:** ▮

**QD.2 — Where does the library live — left/right sidebar, or a drawer that hides for more canvas
room?**
- *Recommendation:* **A collapsible side panel** (RTL → right side), collapsible to maximize the
  page. — *why:* balances browse access with canvas space.
- **Answer:** ▮

**QD.3 — What are the "end states" — just export, or also save/share a link?**
- *Recommendation:* **Export (print/PDF) + local autosave only.** No share links (no backend). —
  *why:* honest to constraints; the PDF *is* the shareable artifact.
- **Answer:** ▮

---

## E. UX & interactions

🎯 *Changes:* how the canvas feels — the heart of the product.

**QE.1 — Placement model: free-form drag, snap-to-grid, or auto-flow/columns?**
- *Recommendation:* **Snap-to-grid with free nudging** (grid on by default, hold a key to place
  freely). — *why:* gives clean alignment without fighting the user — the sweet spot for a tidy
  sheet.
- **Answer:** ▮

**QE.2 — How do students fit *more* on the page — manual resize, or a global "density/zoom"
control to shrink everything?**
- *Recommendation:* **Both: per-block resize + a global font-scale slider** for the whole sheet. —
  *why:* cramming maximum formulas onto one A4 is the real job-to-be-done.
- **Answer:** ▮

**QE.3 — Should there be an overflow warning when content exceeds the printable A4 area?**
- *Recommendation:* **Yes — a clear "off-page" indicator + a faded margin guide.** — *why:*
  nothing worse than printing and discovering a cut-off formula.
- **Answer:** ▮

**QE.4 — Multi-select / align / distribute tools, or keep it dead simple?**
- *Recommendation:* **Keep MVP simple (move/resize/delete/z-order); multi-select is stretch.** —
  *why:* protect the timeline; alignment is mostly handled by snapping.
- **Answer:** ▮

---

## F. UI look & feel

🎯 *Changes:* the entire visual mood.

**QF.1 — Visual mood: clean academic/minimal, "engineering graph-paper notebook," or modern
SaaS?**
- *Recommendation:* **Clean academic with a subtle graph-paper canvas.** — *why:* signals
  "serious study tool," and graph-paper reinforces the A4/print mental model.
- **Answer:** ▮

**QF.2 — How should a formula tile look (just the rendered math, or math + label + a topic color
tag)?**
- *Recommendation:* **Rendered math + small Hebrew label + a subtle topic-color dot.** — *why:*
  scannability when browsing dozens of formulas.
- **Answer:** ▮

**QF.3 — Should the *printed* sheet show labels/colors, or pure formulas only?**
- *Recommendation:* **Pure formulas by default, with an optional "show labels" toggle.** — *why:*
  exams usually want dense math; labels are a personal preference.
- **Answer:** ▮

**QF.4 — Reference apps whose feel you like (Notion, Figma, Excalidraw, Canva, GoodNotes)?**
- *Recommendation:* **Excalidraw's calm canvas + Canva's drag simplicity.** — *why:* approachable,
  not intimidating, fast to grasp.
- **Answer:** ▮ *(name any you love/hate)*

---

## G. Content & tone

🎯 *Changes:* the formula library's framing and copy voice.

**QG.1 — How is the library organized for browsing — by course → topic, by exam, or searchable
flat list?**
- *Recommendation:* **Course → topic accordions + a global search.** — *why:* matches how
  students think and supports both browse and hunt.
- **Answer:** ▮

**QG.2 — Can users add their own formula (type LaTeX / freehand text), or only use the library?**
- *Recommendation:* **Library + free-text/header blocks in MVP; custom-LaTeX input as stretch.**
  — *why:* covers the "one missing formula" case without building an editor first.
- **Answer:** ▮

**QG.3 — Copy voice — warm/encouraging, neutral/efficient, or witty?**
- *Recommendation:* **Warm but efficient** ("בהצלחה במבחן 💪" at export), minimal chrome. — *why:*
  a stressed user wants calm competence, not jokes mid-task.
- **Answer:** ▮

**QG.4 — How important is it that formulas are verifiably *correct/official* for the demo?**
- *Recommendation:* **Use standard, recognizable formulas and keep LaTeX visible/editable;** don't
  claim "official BGU." — *why:* credibility without overpromising.
- **Answer:** ▮

---

## H. Onboarding & first run

🎯 *Changes:* tutorial cost vs intuition.

**QH.1 — Tutorial, or learn-by-doing?**
- *Recommendation:* **Learn-by-doing** with one-line inline hints ("גרור נוסחה לדף") + a starter
  sheet. — *why:* the interaction is intuitive; a tutorial wall would add friction.
- **Answer:** ▮

**QH.2 — Empty-canvas state — what's there before they start?**
- *Recommendation:* **A faint "drag your first formula here" ghost + the course picker pulsing.**
  — *why:* directs the very first action.
- **Answer:** ▮

---

## I. Edge & failure UX

🎯 *Changes:* trust under imperfect conditions.

**QI.1 — If the embedded sandbox blocks the print dialog, the fallback is a rasterized download
(slightly softer math). How should we present that?**
- *Recommendation:* **Default to print; offer "הורד PDF" quietly as a backup**, no scary warning.
  — *why:* most users never hit it; don't alarm them.
- **Answer:** ▮

**QI.2 — On reload, restore the last sheet silently or ask "continue / start fresh"?**
- *Recommendation:* **Restore silently + a small "started over?" reset button.** — *why:*
  least-surprise; their work just reappears.
- **Answer:** ▮

---

## J. Scope & priorities

🎯 *Changes:* what survives if time runs short.

**QJ.1 — If you could ship only ONE thing perfectly, which?**
- *Recommendation:* **Drag-place-and-export of library formulas on one A4.** — *why:* that single
  flow is the entire value proposition.
- **Answer:** ▮

**QJ.2 — Rank these extras (1=first to build, 4=first to cut): two-sided sheet · custom LaTeX
input · per-formula colors/highlight · undo-redo.**
- *Recommendation:* **undo-redo → two-sided → custom LaTeX → colors.** — *why:* safety and
  capacity matter more than cosmetics under time pressure.
- **Answer:** ▮

---

## K. Success & demo feel

🎯 *Changes:* the demo script's climax.

**QK.1 — The exact demo "wow" moment — what do we show?**
- *Recommendation:* **Build a believable Linear Algebra sheet in ~60s, hit export, open a crisp
  PDF, and "walk into the exam."** — *why:* fast, real, tangible.
- **Answer:** ▮

**QK.2 — One sentence: how should a judge feel after seeing it?**
- *Recommendation:* "I wish I'd had this for my finals." — *why:* that's the win condition for a
  utility app.
- **Answer:** ▮

---

### Done? Confirm/edit above. Pair with `PRODUCT-VISION.md` and the other two `DISCOVERY.md` files.
