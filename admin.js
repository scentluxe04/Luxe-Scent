import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://xriigqgpokcvvnnennal.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Rkn_UFAvrKoV6QomDyguTw_08RU7xVh';

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const $ = (id) => document.getElementById(id);

let editingId = null;
let editingImageUrl = '';
let products = [];

function showMessage(id, message, isError = false) {
  const el = $(id);
  if (!el) return;
  el.textContent = message;
  el.style.color = isError ? '#b42318' : '#24734b';
}

function setLoggedIn(isLoggedIn, email = '') {
  $('login-section').hidden = isLoggedIn;
  $('dashboard-section').hidden = !isLoggedIn;

  if ($('signed-in-user')) {
    $('signed-in-user').textContent = email;
  }
}

function resetForm() {
  editingId = null;
  editingImageUrl = '';
  $('product-form').reset();

  if ($('product-id')) $('product-id').value = '';
  if ($('form-title')) $('form-title').textContent = 'Shto parfum të ri';
  if ($('save-product-button')) {
    $('save-product-button').textContent = 'Ruaj produktin';
  }
  if ($('cancel-edit-button')) $('cancel-edit-button').hidden = true;
  if ($('image-preview')) {
    $('image-preview').removeAttribute('src');
    $('image-preview').hidden = true;
  }

  showMessage('product-message', '');
}

function showImagePreview(file) {
  const preview = $('image-preview');
  if (!preview || !file) return;

  if (preview.dataset.previewUrl) {
    URL.revokeObjectURL(preview.dataset.previewUrl);
  }

  const url = URL.createObjectURL(file);
  preview.dataset.previewUrl = url;
  preview.src = url;
  preview.hidden = false;
}

async function uploadImage(file) {
  if (!file) return editingImageUrl;

  if (!file.type.startsWith('image/')) {
    throw new Error('Zgjidh një skedar fotografie.');
  }

  const safeName = file.name.replace(/[^\w.-]/g, '-');
  const path = `${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file, {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(path);

  return data.publicUrl;
}

async function loadProducts() {
  showMessage('product-message', '');

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    showMessage(
      'product-message',
      `Nuk u ngarkuan produktet: ${error.message}`,
      true
    );
    return;
  }

  products = data || [];
  renderProducts();
}

function renderProducts() {
  const container = $('products-list');
  if (!container) return;

  container.replaceChildren();

  if (products.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Nuk ka ende produkte në databazë.';
    container.appendChild(empty);
    return;
  }

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'admin-product-card';

    if (product.image_url) {
      const img = document.createElement('img');
      img.src = product.image_url;
      img.alt = product.name;
      img.loading = 'lazy';
      img.className = 'admin-product-image';
      card.appendChild(img);
    }

    const details = document.createElement('div');
    details.className = 'admin-product-details';

    const name = document.createElement('h3');
    name.textContent = product.name;

    const info = document.createElement('p');
    info.textContent =
      `${product.brand || ''} · ${product.category} · ` +
      `${product.price} L · Gjendja: ${product.stock}`;

    const status = document.createElement('p');
    status.textContent = product.is_active
      ? 'Aktiv në katalog'
      : 'Joaktiv në katalog';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Ndrysho';
    editButton.addEventListener('click', () => editProduct(product.id));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Fshi';
    deleteButton.addEventListener('click', () => deleteProduct(product.id));

    details.append(name, info, status, editButton, deleteButton);
    card.appendChild(details);
    container.appendChild(card);
  });
}

function editProduct(id) {
  const product = products.find((item) => String(item.id) === String(id));
  if (!product) return;

  editingId = product.id;
  editingImageUrl = product.image_url || '';

  $('product-id').value = product.id;
  $('name').value = product.name || '';
  $('brand').value = product.brand || '';
  $('category').value = product.category || 'UNISEX';
  $('price').value = product.price ?? '';
  $('size').value = product.size || '100 ml';
  $('stock').value = product.stock ?? 0;
  $('description').value = product.description || '';
  $('top-notes').value = product.top_notes || '';
  $('heart-notes').value = product.heart_notes || '';
  $('base-notes').value = product.base_notes || '';
  $('is-active').checked = Boolean(product.is_active);
  $('image').value = '';

  const preview = $('image-preview');
  if (preview) {
    if (editingImageUrl) {
      preview.src = editingImageUrl;
      preview.hidden = false;
    } else {
      preview.removeAttribute('src');
      preview.hidden = true;
    }
  }

  $('form-title').textContent = 'Ndrysho parfumin';
  $('save-product-button').textContent = 'Ruaj ndryshimet';
  $('cancel-edit-button').hidden = false;
  showMessage('product-message', '');

  $('product-form').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

async function saveProduct(event) {
  event.preventDefault();
  showMessage('product-message', '');

  const button = $('save-product-button');
  button.disabled = true;

  try {
    const name = $('name').value.trim();
    const price = Number($('price').value);
    const stock = Number($('stock').value);

    if (!name) throw new Error('Vendos emrin e parfumit.');
    if (!Number.isFinite(price) || price < 0) {
      throw new Error('Vendos një çmim të vlefshëm.');
    }
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error('Gjendja duhet të jetë numër i plotë, zero ose më shumë.');
    }

    const file = $('image').files[0];
    const imageUrl = await uploadImage(file);

    if (!imageUrl) {
      throw new Error('Zgjidh një fotografi për parfumin.');
    }

    const productData = {
      name,
      brand: $('brand').value.trim(),
      category: $('category').value,
      price,
      size: $('size').value.trim() || '100 ml',
      stock,
      description: $('description').value.trim(),
      top_notes: $('top-notes').value.trim(),
      heart_notes: $('heart-notes').value.trim(),
      base_notes: $('base-notes').value.trim(),
      image_url: imageUrl,
      is_active: $('is-active').checked
    };

    let result;

    if (editingId !== null) {
      result = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingId);
    } else {
      result = await supabase
        .from('products')
        .insert(productData);
    }

    if (result.error) throw result.error;

    resetForm();
    showMessage(
      'product-message',
      editingId === null
        ? 'Produkti u ruajt me sukses!'
        : 'Ndryshimet u ruajtën me sukses!'
    );

    await loadProducts();
  } catch (error) {
    showMessage(
      'product-message',
      error.message || 'Ndodhi një gabim gjatë ruajtjes.',
      true
    );
  } finally {
    button.disabled = false;
  }
}

async function deleteProduct(id) {
  const product = products.find((item) => String(item.id) === String(id));
  if (!product) return;

  const confirmed = window.confirm(
    `A dëshiron ta fshish parfumin "${product.name}"?`
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    showMessage(
      'product-message',
      `Produkti nuk u fshi: ${error.message}`,
      true
    );
    return;
  }

  showMessage('product-message', 'Produkti u fshi me sukses.');
  await loadProducts();
}

async function checkSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    showMessage('login-message', error.message, true);
    return;
  }

  const session = data.session;

  setLoggedIn(Boolean(session), session?.user?.email || '');

  if (session) await loadProducts();
}

$('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('login-message', '');

  const button = $('login-form').querySelector('button[type="submit"]');
  if (button) button.disabled = true;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: $('email').value.trim(),
      password: $('password').value
    });

    if (error) throw error;

    setLoggedIn(true, data.user.email || '');
    await loadProducts();
  } catch (error) {
    setLoggedIn(false);
    showMessage(
      'login-message',
      error.message || 'Hyrja dështoi. Kontrollo të dhënat.',
      true
    );
  } finally {
    if (button) button.disabled = false;
  }
});

$('logout-button').addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    showMessage('product-message', error.message, true);
    return;
  }

  setLoggedIn(false);
  resetForm();
});

$('product-form').addEventListener('submit', saveProduct);
$('cancel-edit-button').addEventListener('click', resetForm);
$('refresh-button').addEventListener('click', loadProducts);

$('image').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) showImagePreview(file);
});

supabase.auth.onAuthStateChange((_event, session) => {
  setLoggedIn(Boolean(session), session?.user?.email || '');
});

checkSession();
