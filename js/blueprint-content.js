/* 🛠 The Case Management course's Trainer blueprint (lsh-blueprint.js draws it; lsh-blueprint-course.js adds it
   to 🧭 Orientation). The Trainee blueprint is the Orientation deck itself (orientSlides), at /blueprint.pdf.
   A slide is { icon, title, points: [...], where, tip }. Change the wording here; the page and the PDF are made
   from it each time, stamped with the deployed build. README → Trainer tools. */
window.LSH_BLUEPRINT = {
  product: 'Case Management Training',
  site: 'LSH Case Management Training (5-Day)',
  file: 'LSH_CM',
  trainer: {
    sub: 'Running the 5-day Case Management course: the trainer side of the portal',
    slides: [
      { icon: '🔑', title: 'Signing in as a trainer', points: [
          'Admin sign-in with the trainer passphrase. The server checks it, and every request after it needs your signed session.',
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
          '🧭 Orientation is the Trainee blueprint to share on day one; it\'s also /blueprint.pdf, in trainees\' Handouts.'],
        where: 'Admin → 🕘 Attendance · 👁 Trainee view · 🧭 Orientation.',
        tip: 'The Trainee blueprint PDF republishes itself after every update; nothing to do by hand.' }
    ]
  }
};
