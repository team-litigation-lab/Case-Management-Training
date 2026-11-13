/* ============================================================
   🔤 THE STANDARD FONT: League Spartan, everywhere on the site
   ------------------------------------------------------------
   One family for the course: the lessons and slides, the dashboard, the admin pages and the Batch Sheet. It replaces
   Inter, Poppins, Fraunces, IBM Plex Mono and Arial wherever a page set them (the rule's id-level weight wins over every
   class rule, !important ones too). Left as they are: a signature (.cert-sig), the pages a trainee writes in the
   document editor (.wd-page, whose font they pick), and code.
   ============================================================ */
(function(){
  if(document.getElementById("cmFontStd")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet"; link.id = "cmFontStdLink";
  link.href = "https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap";
  document.head.appendChild(link);
  const css = document.createElement("style");
  css.id = "cmFontStd";
  css.textContent = `
:root{--font-ui:'League Spartan',-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}
html body, html body :not(#cmFontStd):not(code):not(pre):not(kbd):not(samp):not(.cert-sig):not(.wd-page):not(.wd-page *){font-family:'League Spartan',-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif !important;}
`;
  document.head.appendChild(css);
})();
