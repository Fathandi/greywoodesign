function submitMailto(event) {
  event.preventDefault();

  const name = document.querySelector('input[name="name"]').value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();
  const phone = document.querySelector('input[name="phone"]').value.trim();
  const message = document
    .querySelector('textarea[name="message"]')
    .value.trim();

  const subject = `Message from ${name}`;
  const body = `
Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
    `;

  const mailtoLink = `mailto:info@greywoodesign.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;

  return false;
}
