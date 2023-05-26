function ensureParagraph(el) {
  // add <p> if missing
  if (!el.querySelector('p')) {
    const p = document.createElement('p');
    p.append(...el.childNodes);
    el.append(p);
  }
  return el;
}

function createSelect(fd) {
  const select = document.createElement('select');
  select.id = fd.Field;
  if (fd.Placeholder) {
    const ph = document.createElement('option');
    ph.textContent = fd.Placeholder;
    ph.setAttribute('selected', '');
    ph.setAttribute('disabled', '');
    select.append(ph);
  }
  const values = fd.Values ? fd.Values.split(',') : [];

  fd.Options.split(',').forEach((o, i) => {
    const option = document.createElement('option');
    option.textContent = o.trim();
    option.value = values[i]?.trim() ?? o.trim();
    select.append(option);
  });
  if (fd.Mandatory) {
    select.setAttribute('required', 'required');
  }
  return select;
}

function constructPayload(form) {
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.type === 'checkbox') {
      if (fe.checked) payload[fe.id] = fe.value;
    } else if (fe.id) {
      payload[fe.id] = fe.value;
    }
  });
  return payload;
}

async function submitForm(form) {
  const payload = constructPayload(form);
  const resp = await fetch(form.dataset.action, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  });
  await resp.text();
  return true;
}

function createButton(fd) {
  const button = document.createElement('button');
  button.textContent = fd.Label;
  button.classList.add('button');
  if (fd.Type === 'submit') {
    button.addEventListener('click', async (event) => {
      const form = button.closest('form');
      if (form.checkValidity()) {
        event.preventDefault();
        button.setAttribute('disabled', '');
        if (await submitForm(form)) {
          window.location.href = fd.Extra;
        }
      }
    });
  }
  return button;
}

function createHeading(fd) {
  const heading = document.createElement('h3');
  heading.textContent = fd.Label;
  return heading;
}

function createInput(fd) {
  const input = document.createElement('input');
  input.type = fd.Type;
  input.id = fd.Field;
  input.setAttribute('placeholder', fd.Placeholder);
  if (fd.Mandatory) {
    input.setAttribute('required', 'required');
  }
  return input;
}

function createTextArea(fd) {
  const input = document.createElement('textarea');
  input.id = fd.Field;
  input.setAttribute('placeholder', fd.Placeholder);
  if (fd.Mandatory) {
    input.setAttribute('required', 'required');
  }
  return input;
}

function createLabel(fd) {
  if (!fd.Label) {
    return null;
  }
  const label = document.createElement('label');
  label.setAttribute('for', fd.Field);
  label.textContent = fd.Label;
  if (fd.Mandatory) {
    label.classList.add('required');
  }
  if (fd.Suffix) {
    const suffix = document.createElement('span');
    suffix.textContent = fd.Suffix;
    label.append(suffix);
  }
  return label;
}

async function getAddresses(fieldWrapper, fd) {
  let addrInfo = fieldWrapper.querySelector('.addresses');
  if (!addrInfo) {
    const resp = await fetch(`${fd.Extra}.plain.html`);
    const fragment = document.createElement('div');
    fragment.innerHTML = await resp.text();
    addrInfo = fragment.querySelector('.addresses');
    // eslint-disable-next-line no-restricted-syntax
    for (const child of [...addrInfo.children]) {
      const key = child.firstElementChild.textContent.trim();
      const address = child.lastElementChild;
      const fieldId = `region-${key.toLowerCase()}`;
      address.classList.add(fieldId);
      address.classList.add('hidden');
      // move to parent
      child.remove();
      ensureParagraph(address);
      addrInfo.append(address);
    }
    fieldWrapper.append(addrInfo);
  }
  return addrInfo;
}

function initRegionSelection(fieldWrapper, fd) {
  const select = fieldWrapper.querySelector('select');
  select.addEventListener('change', async () => {
    const addresses = await getAddresses(fieldWrapper, fd);
    const key = `region-${select.value.toLowerCase()}`;
    // eslint-disable-next-line no-restricted-syntax
    for (const addr of addresses.children) {
      if (addr.classList.contains(key)) {
        addr.classList.remove('hidden');
      } else {
        addr.classList.add('hidden');
      }
    }
  });
}

function createValidateLabel(msg) {
  const el = document.createElement('div');
  el.className = 'form-validate-label';
  el.textContent = msg;
  return el;
}

function validateForm(form) {
  const button = form.querySelector('.form-submit-wrapper > button');
  if (button) {
    if (form.checkValidity()) {
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('disabled', '');
    }
  }
}

function validateField(el, fd) {
  if (fd.Mandatory) {
    const wrapper = el.parentElement;
    if (el.value) {
      wrapper.classList.remove('invalid');
    } else {
      wrapper.classList.add('invalid');
    }
    validateForm(el.closest('form'));
  }
}

window.captchaRenderCallback = () => {
  // eslint-disable-next-line no-console
  console.error('captcha not configured');
};

function createCaptcha(fd) {
  const cc = document.createElement('div');

  window.captchaRenderCallback = () => {
    // eslint-disable-next-line no-undef
    grecaptcha.render(cc, {
      sitekey: fd.Extra,
      callback: (response) => {
        if (response) {
          validateForm(cc.closest('form'));
        }
      },
    });
    const resp = document.getElementById('g-recaptcha-response');
    resp.setAttribute('required', 'required');
  };

  const script = document.createElement('script');
  script.setAttribute('async', 'async');
  script.setAttribute('defer', 'defer');
  script.src = 'https://www.google.com/recaptcha/api.js?onload=captchaRenderCallback&render=explicit';
  document.head.appendChild(script);
  return cc;
}

async function createForm(formURL) {
  const { pathname } = new URL(formURL);
  const resp = await fetch(pathname);
  const json = await resp.json();
  const form = document.createElement('form');
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];
  // eslint-disable-next-line no-restricted-syntax
  for (const fd of json.data) {
    fd.Type = fd.Type || 'text';
    const fieldWrapper = document.createElement('div');
    const style = fd.Style ? ` form-${fd.Style}` : '';
    const fieldId = `form-${fd.Type}-wrapper${style}`;
    fieldWrapper.className = fieldId;
    fieldWrapper.classList.add('field-wrapper');

    const append = (el) => {
      if (el) {
        fieldWrapper.append(el);
      }
    };

    const appendField = (fn) => {
      const el = fn(fd);
      fieldWrapper.append(el);
      if (fd.Mandatory) {
        const msgEl = createValidateLabel(fd.Mandatory);
        fieldWrapper.append(msgEl);
        el.addEventListener('blur', () => validateField(el, fd));
      }
    };

    switch (fd.Type) {
      case 'select':
        append(createLabel(fd));
        appendField(createSelect);
        break;
      case 'heading':
        append(createHeading(fd));
        break;
      case 'checkbox':
        append(createInput(fd));
        append(createLabel(fd));
        break;
      case 'text-area':
        append(createLabel(fd));
        appendField(createTextArea);
        break;
      case 'submit':
        append(createButton(fd));
        break;
      case 'captcha':
        append(createCaptcha(fd));
        break;
      default:
        append(createLabel(fd));
        appendField(createInput);
    }

    // special logic for region selector
    if (fd.Field === 'region') {
      initRegionSelection(fieldWrapper, fd);
    }
    form.append(fieldWrapper);
  }
  validateForm(form);
  return (form);
}

export default async function decorate(block) {
  const form = block.querySelector('a[href$=".json"]');
  if (form) {
    form.replaceWith(await createForm(form.href));
  }
  // convert 2nd row to form-note
  const note = block.querySelector('div > div:nth-child(2) > div');
  if (note) {
    ensureParagraph(note);
    note.classList.add('form-note');
  }
}
