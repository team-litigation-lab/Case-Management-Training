/* ============================================================
   📄 Drafting Tools — HIPAA Drafting: the authorization form
   HAND-AUTHORED, not generated: the firm sent this one as a filled PDF example (INTAKE - HIPAA 2.0,
   for training purposes), not a .docx with yellow highlighting to key a generator off of (see
   build/lor/make_lor_data.py and build/medprov/make_medprov_data.py for the two tools that are
   generated). The wording below is the firm's own, copied from that PDF unchanged; only the blanks
   the source PDF itself left blank — or that a VA fills in differently for each provider — are
   marked as fields. The patient-identifying fields carry the PDF's own training example (John Test
   Doe) as their placeholder, the same demo client used throughout these templates.
     • CM_HIPAA_TEMPLATE   one template, block by block. A field is {f, ph, k}; everything else is
                           the firm's own fixed wording. The acknowledgement date, signature and
                           "Relationship to Patient" at the end are completed and signed by the
                           CLIENT, not the VA, so they stay fixed, uneditable blank lines.
                           k: "field"  an ordinary fill-in
   ============================================================ */
window.CM_HIPAA_TEMPLATE = {"id":"hipaa","title":"HIPAA Compliant Authorization Form","naming":"HIPAA – [Provider or Facility Name] mm.dd.yyyy (VA's name)","blocks":[
  {"t":"p","runs":[{"x":"HIPAA COMPLIANT AUTHORIZATION FORM FOR USE AND DISCLOSURE","b":true}],"c":1},
  {"t":"p","runs":[{"x":"OF PROTECTED HEALTH INFORMATION","b":true}],"c":1},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"I, "},{"f":"f1","ph":"John Test Doe","k":"field"},{"x":", hereby authorize the use or disclosure of my protected health information as described below. My identifying information is as follows:"}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"Patient Name:\t","b":true},{"f":"f1b","ph":"John Test Doe","k":"field"}]},
  {"t":"p","runs":[{"x":"Patient Date of Birth:\t","b":true},{"f":"f2","ph":"March 28, 1997","k":"field"}]},
  {"t":"p","runs":[{"x":"Patient Social Security #:\t","b":true},{"f":"f3","ph":"111-22-2123","k":"field"}]},
  {"t":"p","runs":[{"x":"Patient Phone Number:\t","b":true},{"f":"f4","ph":"(725) 246-1614","k":"field"}]},
  {"t":"p","runs":[{"x":"Patient Address:\t","b":true},{"f":"f5","ph":"123 Banana Road, Lakewood, WA 98499","k":"field"}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"I. AUTHORIZED PERSONS TO USE AND DISCLOSE PROTECTED HEALTH INFORMATION","b":true}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"f":"f6","ph":"[Provider or facility name]","k":"field"},{"x":" is authorized to disclose the following protected health information to Van Law Firm, 1290 S. Jones Blvd., Las Vegas, Nevada 89146, P: (725) 900-9000, F: (702) 852-5760."}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"II. DESCRIPTION OF INFORMATION TO BE DISCLOSED","b":true}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"Entire record and billing from medical treatment for injury or accident on "},{"f":"f7","ph":"February 01, 2018","k":"field"},{"x":" to present. This includes, but is not limited to:"}],"n":1},
  {"t":"p","runs":[{"x":"Photocopies of all medical records, to include, but not be limited to, records, reports, handwritten notes and any"}]},
  {"t":"p","runs":[{"x":"Memorandum, correspondence, nurse’s notes, physician’s orders, operative reports, pain questionnaires, histories, in-take sheets, laboratory results, and all diagnostic reports and films, including"}]},
  {"t":"p","runs":[{"x":"X-rays, MRI films, CT scans, and discography films, and"}]},
  {"t":"p","runs":[{"x":"All itemized billing statements for the dates of services listed concerning my physical condition, treatment and hospitalization"}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"III. INFORMATION NOT TO BE DISCLOSED","b":true}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"This authorization "},{"x":"IS NOT","b":true},{"x":" to include the disclosure of information relating to alcohol and drug abuse, mental health treatment (except psychotherapy notes), genetic testing information, and confidential AIDS/HIV related information."}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"IV. PURPOSE OF THE USE OR DISCLOSURE","b":true}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"The purpose of this use or disclosure is so that my attorney may pursue an injury claim."}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"V. VALIDITY OF AUTHORIZATION FORM","b":true}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"This Authorization Form is valid beginning on "},{"f":"f8","ph":"[today's date]","k":"date"},{"x":" and expires 5 years from "},{"f":"f9","ph":"[same date as above]","k":"field"},{"x":" or when my injury claim has been resolved, whichever comes first."}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"VI. ACKNOWLEDGEMENT","b":true}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"I hereby authorize you to release the requested information to the above stated entity. I understand that I may revoke this authorization at any time, and I must do so in writing. I understand that the revocation does not apply to information already released in response to this authorization. I further understand that once the above information is disclosed, it may be redisclosed by the recipient and the information may not be protected by federal privacy laws or regulations. This authorization expires at the conclusion of my claim. My treatment, payment, enrollment or eligibility for benefits may not be conditioned on signing this authorization. I understand that when the information is used or disclosed, pursuant to this authorization, it may be subject to re-disclosure by the recipient and may no longer be protected health information. As a condition to the use of this Authorization, the Recipient (if not the VAN LAW FIRM) agrees to, and will promptly, provide the VAN LAW FIRM, copies of any and all documents or other items obtained by virtue of this Authorization, without charge. This Authorization, if not being used the VAN LAW FIRM or their designated agent, representative or expert witnesses, does not allow the recipient to have any direct communication with my medical providers, other than to request records and billing from the medical providers without written permission from the VAN LAW FIRM."}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"Date: ______________________\tSignature: _________________________ (the client signs — not the VA)"}]},
  {"t":"p","runs":[]},
  {"t":"p","runs":[{"x":"Relationship to Patient: _________________________ (leave blank unless someone signs on the client's behalf)"}]}
]};
