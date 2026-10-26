import { CATEGORIES, PRODUCTS } from '../src/data/products.js';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '..');

const VALID_BADGES = ['MAIS VENDIDOS', 'PREMIUM', 'NOVO', 'EXCLUSIVO', 'ESGOTADO'];
const VALID_CATEGORIES = new Set(CATEGORIES.map(c => c.id));
const PRODUCTS_WITH_BUYLINKS_NO_PRICES = new Set([9, 17]);
const PRODUCTS_WITHOUT_SHORTNAME = new Set([3, 4, 10]);

const errors = [];
const warnings = [];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed !== url) return false;
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

function validateLinks(product) {
  const { id } = product;

  if (product.buyLink !== undefined) {
    if (!isValidUrl(product.buyLink)) {
      addError(`Produto ${id}: buyLink inválido ou com espaços - "${product.buyLink}"`);
    }
  }

  if (product.buyLinks && Array.isArray(product.buyLinks)) {
    product.buyLinks.forEach((bl, idx) => {
      if (!isValidUrl(bl.link)) {
        addError(`Produto ${id}: buyLinks[${idx}].link inválido ou com espaços - "${bl.link}"`);
      }
      if (bl.size === undefined || bl.size === null || bl.size === '') {
        addError(`Produto ${id}: buyLinks[${idx}] sem size`);
      }
    });
  }

  if (!product.buyLink && (!product.buyLinks || product.buyLinks.length === 0)) {
    addError(`Produto ${id}: sem buyLink nem buyLinks`);
  }
}

function validateIds() {
  const seen = new Map();
  PRODUCTS.forEach(p => {
    if (seen.has(p.id)) {
      addError(`ID duplicado: ${p.id} (produtos: "${seen.get(p.id)}", "${p.name}")`);
    } else {
      seen.set(p.id, p.name);
    }
  });
}

function validateCategories(product) {
  const { id } = product;
  if (product.category && Array.isArray(product.category)) {
    product.category.forEach(cat => {
      if (!VALID_CATEGORIES.has(cat)) {
        addError(`Produto ${id}: categoria inválida "${cat}"`);
      }
    });
  } else {
    addError(`Produto ${id}: category ausente ou não é array`);
  }
}

function validatePricesAndBuyLinks(product) {
  const { id } = product;
  const hasPrices = Array.isArray(product.prices) && product.prices.length > 0;
  const hasBuyLinks = Array.isArray(product.buyLinks) && product.buyLinks.length > 0;

  if (!hasPrices && !hasBuyLinks) return;

  if (PRODUCTS_WITH_BUYLINKS_NO_PRICES.has(id)) {
    if (hasPrices) {
      addWarning(`Produto ${id}: exceção conhecida (buyLinks sem prices), mas tem prices`);
    }
    return;
  }

  if (hasPrices && hasBuyLinks) {
    const priceSizes = product.prices.map(p => p.size).sort();
    const buyLinkSizes = product.buyLinks.map(bl => bl.size).sort();

    if (priceSizes.length !== buyLinkSizes.length) {
      addError(`Produto ${id}: prices (${priceSizes.length}) e buyLinks (${buyLinkSizes.length}) têm quantidades diferentes de tamanhos`);
    } else {
      const mismatched = priceSizes.filter((s, i) => s !== buyLinkSizes[i]);
      if (mismatched.length > 0) {
        addError(`Produto ${id}: tamanhos não correspondem - prices: [${priceSizes.join(', ')}], buyLinks: [${buyLinkSizes.join(', ')}]`);
      }
    }
  } else if (hasPrices && !hasBuyLinks) {
    addWarning(`Produto ${id}: tem prices mas não tem buyLinks`);
  } else if (!hasPrices && hasBuyLinks) {
    addWarning(`Produto ${id}: tem buyLinks mas não tem prices (exceto IDs 9 e 17)`);
  }
}

function validateBadges(product) {
  const { id, badge } = product;
  if (badge !== null && badge !== undefined && badge !== '') {
    if (!VALID_BADGES.includes(badge)) {
      addError(`Produto ${id}: badge inválido "${badge}". Valores válidos: ${VALID_BADGES.join(', ')}`);
    }
  }
}

function validateImage(product) {
  const { id, image } = product;
  if (!image || typeof image !== 'string') {
    addError(`Produto ${id}: image ausente ou inválida`);
    return;
  }

  const expectedPath = image.startsWith('/') ? image.slice(1) : image;
  const fullPath = resolve(PROJECT_ROOT, 'public', expectedPath);

  if (!existsSync(fullPath)) {
    addError(`Produto ${id}: imagem não encontrada em ${fullPath}`);
  }
}

function validateRequiredFields(product) {
  const { id, name } = product;

  if (!id || typeof id !== 'number') {
    addError(`Produto sem ID válido: ${JSON.stringify(product).slice(0, 100)}`);
  }

  if (!name || typeof name !== 'string' || name.trim() === '') {
    addError(`Produto ${id}: name ausente ou vazio`);
  }

  if (!product.description || typeof product.description !== 'string' || product.description.trim() === '') {
    addError(`Produto ${id}: description ausente ou vazia`);
  }

  if (!product.price || typeof product.price !== 'string' || product.price.trim() === '') {
    addError(`Produto ${id}: price ausente ou vazio`);
  }

  if (PRODUCTS_WITHOUT_SHORTNAME.has(id)) {
    return;
  }
  if (!product.shortName || typeof product.shortName !== 'string' || product.shortName.trim() === '') {
    addError(`Produto ${id}: shortName ausente (exceto IDs 3, 4, 10)`);
  }
}

function validateCategoryOrder(product) {
  const { id, categoryOrder } = product;
  if (!categoryOrder || typeof categoryOrder !== 'object') {
    addError(`Produto ${id}: categoryOrder ausente ou inválido`);
    return;
  }

  const catKeys = Object.keys(categoryOrder);
  if (catKeys.length === 0) {
    addError(`Produto ${id}: categoryOrder vazio`);
    return;
  }

  catKeys.forEach(cat => {
    if (!VALID_CATEGORIES.has(cat)) {
      addError(`Produto ${id}: categoryOrder contém categoria inválida "${cat}"`);
    }
    const val = categoryOrder[cat];
    if (typeof val !== 'number' || !Number.isInteger(val)) {
      addError(`Produto ${id}: categoryOrder["${cat}"] não é um número inteiro`);
    }
  });

  product.category?.forEach(cat => {
    if (!categoryOrder[cat]) {
      addWarning(`Produto ${id}: categoryOrder não tem peso para categoria "${cat}"`);
    }
  });
}

function runValidation() {
  console.log('🔍 Iniciando validação do catálogo...\n');

  validateIds();

  PRODUCTS.forEach(product => {
    validateRequiredFields(product);
    validateLinks(product);
    validateCategories(product);
    validatePricesAndBuyLinks(product);
    validateBadges(product);
    validateImage(product);
    validateCategoryOrder(product);
  });

  console.log('✅ Validação concluída.\n');

  if (warnings.length > 0) {
    console.log('⚠️  AVISOS:');
    warnings.forEach(w => console.log(`  - ${w}`));
    console.log('');
  }

  if (errors.length > 0) {
    console.log('❌ ERROS ENCONTRADOS:');
    errors.forEach(e => console.log(`  - ${e}`));
    console.log(`\nTotal: ${errors.length} erro(s), ${warnings.length} aviso(s)`);
    process.exit(1);
  } else {
    console.log(`✅ Catálogo válido! ${warnings.length} aviso(s).`);
    process.exit(0);
  }
}

runValidation();