import { expect, test } from '@playwright/test'

test('a visitor can browse a listing, the about page, and a missing page', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'Chez vous, partout et ailleurs' }),
  ).toBeVisible()

  await page.getByRole('link', { name: /Appartement cosy/ }).click()
  await expect(page).toHaveURL(/\/logement\/c67ab8a7$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Appartement cosy' })).toBeVisible()
  await expect(page.getByText('Ile de France - Paris 17e')).toBeVisible()

  await page.getByRole('button', { name: 'Photo suivante' }).click()
  await expect(page.getByText('2/5')).toBeVisible()

  await page.getByRole('button', { name: 'Description' }).click()
  await expect(page.getByText(/Votre maison loin de chez vous/)).toBeVisible()

  await page.getByRole('link', { name: 'À Propos' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await page.getByRole('button', { name: 'Fiabilité' }).click()
  await expect(page.getByText(/fiabilité totale/)).toBeVisible()

  await page.goto('/cette-page-n-existe-pas')
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  await page.getByRole('link', { name: "Retourner sur la page d'accueil" }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByRole('heading', { name: 'Chez vous, partout et ailleurs' }),
  ).toBeVisible()
})
