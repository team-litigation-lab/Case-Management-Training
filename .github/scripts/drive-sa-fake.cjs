// (no @check: a helper the Backup Drive checks share) The Backup Drive's Google side as worker.js sees it since it links
// a trainee's folder through the program's service account (as the Foundations training does): the Worker's env for it,
// and the parts of a Drive query (`'<id>' in parents`, `name = '…'`, `mimeType = / != …`) an in-memory Drive answers.
const crypto = require('crypto');
const FOLDER = 'application/vnd.google-apps.folder';
let pem = '';
/* GDRIVE_SA_EMAIL and GDRIVE_SA_KEY (a real PKCS#8 key, made once: the Worker signs its token request with it) */
function saEnv() {
  if (!pem) pem = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' });
  return { GDRIVE_SA_EMAIL: 'lsh-backup@ci-project.iam.gserviceaccount.com', GDRIVE_SA_KEY: pem };
}
/* A file of the fake Drive ({name, mimeType, parents, trashed}) against a Drive query. */
function qMatch(q) {
  q = String(q || '');
  const parent = (q.match(/'([^']+)' in parents/) || [])[1];
  const nm = (q.match(/name = '((?:[^'\\]|\\.)*)'/) || [])[1];
  const folder = /mimeType = /.test(q) ? true : /mimeType != /.test(q) ? false : null;
  return (f) => !f.trashed && (!parent || (f.parents || [])[0] === parent) && (nm == null || f.name === nm.replace(/\\(.)/g, '$1')) && (folder === null || (f.mimeType === FOLDER) === folder);
}
/* What GET /files/<id> answers for a file the fake holds. */
const fileMeta = (id, f) => ({ id, name: f.name, mimeType: f.mimeType, trashed: !!f.trashed, capabilities: { canAddChildren: f.mimeType === FOLDER && f.canEdit !== false }, owners: [{ emailAddress: 'ana@example.com' }] });
const folderUrl = (id) => `https://drive.google.com/drive/folders/${id}`;
module.exports = { saEnv, qMatch, fileMeta, folderUrl, FOLDER };
