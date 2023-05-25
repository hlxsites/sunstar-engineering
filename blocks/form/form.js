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
  return payload;
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
        await submitForm(form);
        const redirectTo = fd.Extra;
        window.location.href = redirectTo;
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

function createAddressInfo(fd, rules) {
  // remove address info
  const addrInfoWrapper = document.querySelector('.address-info-wrapper');
  if (!addrInfoWrapper) {
    return null;
  }
  addrInfoWrapper.remove();
  const addrInfo = addrInfoWrapper.firstElementChild;
  // eslint-disable-next-line no-restricted-syntax
  for (const child of addrInfo.children) {
    const key = child.firstElementChild.textContent.trim();
    child.firstElementChild.remove();
    const address = child.firstElementChild;
    const fieldId = `region-${key.toLowerCase()}`;
    address.classList.add(fieldId);
    rules.push({
      fieldId,
      rule: {
        type: 'visible',
        condition: {
          operator: 'eq',
          value: key,
          key: 'region',
        },
      },
    });
  }
  return addrInfo;
}

function applyRules(form, rules) {
  const payload = constructPayload(form);
  rules.forEach((field) => {
    const { type, condition: { key, operator, value } } = field.rule;
    if (type === 'visible') {
      if (operator === 'eq') {
        if (payload[key] === value) {
          form.querySelector(`.${field.fieldId}`).classList.remove('hidden');
        } else {
          form.querySelector(`.${field.fieldId}`).classList.add('hidden');
        }
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

function validateField(el, fd) {
  console.log('field changed', fd.Field, el.value);
  if (fd.Mandatory) {
    const wrapper = el.parentElement;
    if (el.value) {
      wrapper.classList.remove('invalid');
    } else {
      wrapper.classList.add('invalid');
    }
  }
}

async function createForm(formURL) {
  const { pathname } = new URL(formURL);
  const resp = await fetch(pathname);
  const json = await resp.json();
  const form = document.createElement('form');
  const rules = [];
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];
  json.data.forEach((fd) => {
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
      case 'address-info':
        append(createAddressInfo(fd, rules));
        break;
      default:
        append(createLabel(fd));
        appendField(createInput);
    }

    if (fd.Rules) {
      try {
        rules.push({ fieldId, rule: JSON.parse(fd.Rules) });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid Rule ${fd.Rules}: ${e}`);
      }
    }
    form.append(fieldWrapper);
  });

  form.addEventListener('change', () => applyRules(form, rules));
  applyRules(form, rules);

  return (form);
}

export default async function decorate(block) {
  const form = block.querySelector('a[href$=".json"]');
  if (form) {
    form.replaceWith(await createForm(form.href));
  }
}
