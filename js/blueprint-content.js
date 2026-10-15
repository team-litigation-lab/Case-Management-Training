/* 🛠 The Case Management course's blueprints — Trainee and Trainer (lsh-blueprint.js draws them;
   lsh-blueprint-course.js wires them in). Both decks live here: the Trainee blueprint is the
   🧭 Orientation deck (js/cm-orientation.js opens it), drawn on the same cover and the same slide
   layout as the Trainer blueprint, and published at /blueprint.pdf.
   A slide is { icon, title, points: [...], where, tip }. Change the wording here; the page and the PDF are made
   from it each time, stamped with the deployed build. README → Trainer tools. */
window.LSH_BLUEPRINT = {
  product: 'Case Management Training',
  site: 'LSH Case Management Training (5-Day)',
  file: 'LSH_CM',
  trainee: {
    sub: 'Your guide to the portal: the 5-day Case Management Training, day by day',
    slides: [
      { icon: '👋', title: 'Welcome to the program', points: [
          'Five days to work like a confident, organized Case Manager — built around one realistic case, John Doe v. Apex Delivery Services, from Day 1 to Day 5.',
          'Learn: short topics across the five days.',
          'Practice: hands-on Skill Builders and live calls.',
          'Prove: a Knowledge Check each day — and a certificate at the end.',
          "You'll need Chrome or Edge on a computer, a headset with a microphone for the live calls, and a stable connection."],
        where: 'The portal opens from the LSH Training Portal; your dashboard is where you land.',
        tip: 'Your progress saves to your account automatically, so you can pick up on any computer.' },
      { icon: '🗺', title: 'Your 5-day roadmap', points: [
          'Five days, each with its topics and its Skill Builders, listed on your dashboard.',
          'Days open one at a time — each builds on the one before.',
          "Finishing a day's Skill Builders unlocks tomorrow.",
          'Every day you have finished stays open: press Review to go back to it any time.'],
        where: 'Your dashboard — the day cards, in order.',
        tip: 'Read the Case File before Day 1: every lesson and exercise works that one file.' },
      { icon: '🖥', title: 'How every day works', points: [
          '1. Lesson slides: one topic at a time, every slide the same size and whole on one screen (a long one is scaled to fit). Your place is saved.',
          '2. Skill Builders: do the real task. Graded with written feedback, and it auto-saves as you type.',
          '3. Knowledge Check: pass at 70% to mark the day complete ✓. The process questions live here, not between the slides.',
          '4. The next day opens when you finish the Skill Builders.'],
        where: 'Your dashboard → Start (or Review) on a day.',
        tip: 'Didn\'t pass the Knowledge Check? That is a "not yet", not a "no" — you can still move on, and retake it any time. Your best score counts.' },
      { icon: '📷', title: 'Live sessions with your trainer', points: [
          "Your trainer presents the day's slides in Google Meet. They are the same slides you have in the portal — nothing extra to install.",
          'At each checkpoint your trainer pauses for discussion. Answer out loud — a first answer is never wrong, it is where the learning starts.',
          'Every slide fits on one screen (a long one is scaled to fit). On your own, use Next or the ← → keys, 🔊 Listen, or ⛶ Full screen.',
          'Missed something live? Every slide stays in your portal — reopen the day any time and pick up exactly where you left off.'],
        where: 'Google Meet for the session; the same day in your portal afterwards.',
        tip: 'Keep the portal open on the day your trainer is presenting, so you can follow and re-read at your own pace.' },
      { icon: '📚', title: 'Your dashboard at a glance', points: [
          'Progress track: Days 1–5, ✓ = passed, and every day you have reached is open.',
          'Day cards: Start or Review a day, with 💬 trainer feedback appearing on the card.',
          'Under the lessons, your scores band: completion, quiz average, days done, 💬 your feedback and your ranking.',
          'Resume takes you back to where you left off, and the certificate downloads from here when it is earned.',
          'The competency profile: eight skills that grow as your work is graded.'],
        where: 'Your dashboard — every sign-in lands on it.',
        tip: 'Check the day cards for 💬 at the end of each day: that is your trainer\'s feedback waiting.' },
      { icon: '🧭', title: 'Getting around', points: [
          '🎲 Tasks: surprise tasks from your trainer — acknowledge, plan and resolve before the timer ends. Graded.',
          'Case File: John Doe v. Apex, the working case. Read it first. 📁 Case Documents holds every record, bill, lien letter and pleading, with its CMS upload category.',
          '🧪 Practice: every practice tool, the same way for each day — 🧠 Skill Builders on the case documents, 🗣 Communication (live calls, roleplay, email) and 🗂 Systems (the CMS, docket, medical records, e-filing, calendar and trust ledger).',
          'My Notes and Handouts: your private notes, downloadable as a PDF, and printable checklists and Excel templates for each day.',
          '🎯 Focus and 💬 Feedback: your trainer\'s priorities for you, and your say on what is working.'],
        where: 'The top bar. On a phone, everything is under ☰ Menu; Search finds any topic or tool.',
        tip: "Each day's tools open with that day, so you never have to hunt for the right one." },
      { icon: '📂', title: 'The case: John Doe v. Apex Delivery Services', points: [
          "A Valentine's Day T-bone by an Apex commercial F-150 that ran a red light — extrication, facial scarring, a lumbar herniation and surgery.",
          'Every lesson, Skill Builder and CMS exercise works this one file. Day 5 adds Jordan Davies.',
          'Read the Case File before Day 1, then open the documents in 📁 Case Documents.',
          'The documents contain real-world inconsistencies — catching them is the job.',
          'Treat everything as confidential, like a real client file.'],
        where: 'Case File and 📁 Case Documents in the top bar.',
        tip: 'Keep 📁 Case Documents open in a second tab while you work a Skill Builder.' },
      { icon: '🧪', title: 'Skill Builders: how grading works', points: [
          'First try is free: your first submission of each exercise never uses an attempt.',
          "Repeats are per day: each day's Skill Builders have their own, and your trainer can reset them.",
          'Auto-saves: close the tab or switch devices — your work is still there.',
          'Feedback, not just a score: every graded submission shows strengths, what to change ("not this way — here\'s the better way") and next steps.',
          "Nonsense or copy-paste answers aren't graded."],
        where: '🧪 Practice in the top bar; each day\'s tools open with that day.',
        tip: 'Use the free first try to see what the grader is looking for, then do it properly.' },
      { icon: '📞', title: 'Live calls and roleplays', points: [
          '🎧 Use a headset. The caller speaks; you answer out loud (Chrome or Edge) or type.',
          "🔊 Can't hear the caller? Check your volume and press ↻ Replay.",
          '🙋 Hands-free mode listens automatically after the caller finishes.',
          '📞 Hang Up ends the call and gives you your evaluation.'],
        where: '🧪 Practice → 🗣 Communication, inside the day.',
        tip: 'Take the call somewhere quiet: background noise is what costs most people their score.' },
      { icon: '💬', title: 'Feedback, focus and your growth', points: [
          "Trainer feedback: your trainer writes feedback on each day's work — it lights up on the day card and in 🎯 Focus.",
          "🎯 Focus: your trainer's priorities for you, plus suggestions from your own work. Tick items off as you go.",
          'Competency profile: eight skills — accuracy, judgment, risk, efficiency, communication, composure, knowledge and real-time task handling.',
          'The profile grows as your work is graded, so it shows where you are strongest and what to build.'],
        where: '🎯 Focus in the top bar · the competency profile on your dashboard.',
        tip: 'Read the feedback on the day it arrives: it is far easier to act on while the task is fresh.' },
      { icon: '🏅', title: 'Earning your certificate', points: [
          'Pass all 5 Knowledge Checks (70% or better) and your Certificate of Completion unlocks — download it as a PDF from your dashboard.',
          'It shows your name exactly as you registered it, so check your spelling.',
          'Signed by your trainer, the Training Head and the General Manager.',
          '"With Distinction" for a 90% or better average.'],
        where: 'Your dashboard — the certificate sits beside Resume.',
        tip: 'Name spelt wrong? Tell your trainer before the end of the program, not after the certificate is issued.' },
      { icon: '🔒', title: 'Ground rules', points: [
          'Confidentiality first — never paste real client or firm information into any tool.',
          "AI is a tool, not the answer — its use depends on each attorney's preferences; always review its output.",
          'Your own work — the feedback only helps if it is your thinking.',
          'Stuck? Ask your trainer, or use 💬 Feedback to tell us what is unclear.'],
        where: 'Everywhere in the program.',
        tip: 'When two documents in the file disagree, raise it rather than picking one — that is the judgment being graded.' },
      { icon: '🚀', title: "Let's begin", points: [
          '1. Sign in: last name, first name and your batch code.',
          '2. Read the Case File: John Doe v. Apex.',
          '3. Open Day 1 from your dashboard and press Start.',
          'Questions before we start?'],
        where: 'The LSH Training Portal → this program → your dashboard.',
        tip: 'Stuck on anything? Message your trainer with your name, your batch and a screenshot — that is everything they need.' }
    ]
  },
  trainer: {
    sub: 'Running the 5-day Case Management course: the trainer side of the portal',
    slides: [
      { icon: '🔑', title: 'Signing in as a trainer', points: [
          'Admin sign-in with the admin password. The server checks it, and every request after it needs your signed session.',
          'Your top bar adds 🧭 Orientation, the Facilitator Guide, 👁 Trainee view and 🏠 Main Portal (back to the Training Portal\'s Training Directory).',
          'Admin is your trainer dashboard: Trainee Audit, 📁 Batch Folders, Rankings, SOP Reference, Trainer Cues, Content Studio, Trainee Feedback, 📋 Activities, 🗣 Feedback Style and 🕘 Attendance.',
          'Every day is open to you, so you can preview it before you teach it.'],
        where: 'Admin sign-in · Admin in the top bar.',
        tip: 'Trainees open the course from the Training Portal; you approve them here.' },
      { icon: '✅', title: 'Trainees and the Trainee Audit', points: [
          'Approve new trainees, or reject them. Revoke a trainee to close their access.',
          'Each trainee\'s day, lessons, Knowledge Check scores and Skill Builder work, by batch.',
          'Generate an AI review of their work, and reset a tool\'s attempts when they need another try.'],
        where: 'Admin → Trainee Audit.',
        tip: 'Approve the class before the first session, so nobody waits at the start.' },
      { icon: '💬', title: 'Day feedback', points: [
          'Write each day\'s feedback for a trainee, or let ✨ Suggest wording (AI) pre-fill it for you to edit.',
          'Save each day, or send all the drafts together. Trainees read it under 💬 Feedback.',
          'Trainee Feedback shows what trainees said about each day.'],
        where: 'Admin → Trainee Audit → a trainee · Admin → Trainee Feedback.',
        tip: 'One thing they did well, one thing to change: short and specific.' },
      { icon: '🎲', title: 'Surprise tasks and roleplays', points: [
          'Send a 🎲 Surprise Task, generated from the day\'s lessons and the John Doe file. It\'s graded, and you can end it from Admin.',
          'Assign a live roleplay for a client or adjuster scenario.',
          'Both show up on the trainee\'s screen straight away.'],
        where: 'Admin → Trainee Audit → a trainee.',
        tip: 'Use a surprise task to check what the class found hard that morning.' },
      { icon: '🧠', title: 'The Case File and its checkpoints', points: [
          'Trainees build John Doe\'s case from the documents and answer a critical-thinking checkpoint each day.',
          'You see the answer key under every question, and the full case summary.',
          'Open any trainee\'s checkpoint answers, scores and the AI reviewer\'s feedback.'],
        where: 'Top bar → Case File (as a trainer) · Admin → Trainee Audit.',
        tip: 'Go through one checkpoint together in class before trainees do the next on their own.' },
      { icon: '📁', title: 'Case documents and the audit key', points: [
          'The John Doe v. Apex file, the Jordan Davies file, the templates and the handouts.',
          'Signed in as a trainer, every document shows a red 🔑 note with its planted discrepancies.',
          'Trainees never see the 🔑 notes: they have to find the errors themselves.'],
        where: 'Top bar → 📁 Documents.',
        tip: 'Use the 🔑 notes to check what a trainee caught and what they missed.' },
      { icon: '🧪', title: 'Practice, Skill Builders and simulators', points: [
          '🧪 Practice: each day\'s Skill Builders, communication and systems practice, on the real case documents.',
          'The Training Portal\'s simulators: the Case Management call pack, the email workspace and replies, and calendaring.',
          'Scores from the simulators are saved for you to review.'],
        where: 'Top bar → 🧪 Practice, and its 🧰 Training Tools hub for the simulators.',
        tip: 'Assign the day\'s Skill Builder right after its lesson, while it\'s fresh.' },
      { icon: '📋', title: 'SOP Reference', points: [
          '🧭 Program flow: kick-off, the daily rhythm, between sessions and the program close.',
          'Each day\'s timed run of show (Do / Say / Watch for), built from that day\'s live content.',
          'The detailed script, with a 🎤 Present mode for the room.'],
        where: 'Admin → SOP Reference.',
        tip: 'Read the next day\'s run of show the evening before.' },
      { icon: '🖥', title: 'Presenter view', points: [
          'Share only the slides window in Google Meet; your console shows each slide\'s script.',
          'Four beats per slide: the why, talk it through, walk through it, ask the room.',
          'The shared window never flickers or reloads mid-class.'],
        where: 'A day\'s lesson slides → 🖥 Presenter view.',
        tip: 'Open it 15 minutes early, and share the slides window, not your screen.' },
      { icon: '🗂', title: 'Batch Folders, Rankings and Content Studio', points: [
          '📁 Batch Folders: each class in its own folder. Archive a finished batch to clear the list.',
          'Rankings: the class side by side, by progress and scores.',
          'Content Studio: each day\'s lessons, what\'s published and what\'s a draft; add or expand topics and publish them.'],
        where: 'Admin → 📁 Batch Folders · Rankings · Content Studio.',
        tip: 'Preview a change in 👁 Trainee view before the class sees it.' },
      { icon: '📝', title: 'Activities and the feedback style', points: [
          '📋 Activities: publish each day\'s activities and review the submissions.',
          'AI review drafts are written in the facilitator\'s voice; you edit them and send them.',
          '🗣 Feedback Style learns how you write feedback, from your own reviews.'],
        where: 'Admin → 📋 Activities · 🗣 Feedback Style.',
        tip: 'The more of your own reviews it learns from, the more the drafts sound like you.' },
      { icon: '🕘', title: 'Attendance, Trainee view and Orientation', points: [
          '🕘 Attendance: Time In fills in by itself when a trainee opens the course; tag each status and add notes.',
          'It stays in step with the attendance Google Sheet, through the Training Portal.',
          '👁 Trainee view shows the portal exactly as trainees see it.',
          '🧭 Orientation is the deck to share with trainees on day one. The blueprints themselves live on the Main Portal\'s 🧭 Blueprint page, never inside the program.'],
        where: 'Admin → 🕘 Attendance · 👁 Trainee view · 🧭 Orientation.',
        tip: 'The Trainee blueprint PDF republishes itself after every update; nothing to do by hand.' }
    ]
  }
};
