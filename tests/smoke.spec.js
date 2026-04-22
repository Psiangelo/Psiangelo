// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Smoke tests — verificam que cada rota principal renderiza sem erro
 * e contém elementos-chave.
 *
 * Rodar contra o build estático servido localmente:
 *   npm run build
 *   npx serve out -l 3010   (em outra aba)
 *   npx playwright test
 */

test.describe('smoke · renderização básica', () => {
  test('home carrega e mostra marca Psiângelo', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Psiângelo/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('bio (/bio) carrega com links', async ({ page }) => {
    await page.goto('/bio');
    await expect(page.locator('main')).toBeVisible();
  });

  test('materiais renderiza catálogo e botão filtros', async ({ page }) => {
    await page.goto('/materiais');
    await expect(page.getByRole('heading', { name: /Materiais/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Filtros/i })).toBeVisible();
  });

  test('trilhas lista as 3 trilhas canônicas', async ({ page }) => {
    await page.goto('/trilhas');
    await expect(page.getByRole('heading', { name: /Trilhas/i })).toBeVisible();
    await expect(page.getByText(/Começando em Jung/i)).toBeVisible();
  });

  test('blog renderiza (mesmo sem posts)', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('main')).toBeVisible();
  });

  test('cursos renderiza', async ({ page }) => {
    await page.goto('/cursos');
    await expect(page.locator('main')).toBeVisible();
  });

  test('glossário lista pelo menos 10 termos', async ({ page }) => {
    await page.goto('/glossario');
    await expect(page.getByRole('heading', { name: /Glossário/i })).toBeVisible();
    // Cada termo vira um <a> pro detalhe
    const termos = page.locator('a[href*="/glossario/"]');
    await expect(termos).toHaveCount(await termos.count());
    expect(await termos.count()).toBeGreaterThan(10);
  });

  test('glossário · detalhe de termo (Sombra)', async ({ page }) => {
    await page.goto('/glossario/sombra');
    await expect(page.getByRole('heading', { name: 'Sombra' })).toBeVisible();
  });

  test('sitemap.xml é servido', async ({ page }) => {
    const res = await page.goto('/sitemap.xml');
    expect(res?.status()).toBe(200);
    const body = await page.content();
    expect(body).toContain('<urlset');
  });

  test('robots.txt é servido', async ({ page }) => {
    const res = await page.goto('/robots.txt');
    expect(res?.status()).toBe(200);
    const text = await res?.text();
    expect(text).toContain('Sitemap');
  });

  test('feed.xml é RSS válido', async ({ page }) => {
    const res = await page.goto('/feed.xml');
    expect(res?.status()).toBe(200);
    const text = await res?.text();
    expect(text).toContain('<rss');
    expect(text).toContain('<channel>');
  });

  test('command palette abre com Cmd+K', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+K');
    await expect(page.getByPlaceholder(/Buscar no site/i)).toBeVisible();
  });
});
