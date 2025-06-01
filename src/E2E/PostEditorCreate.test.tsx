import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('PostEditorCreate component', () => {
	test.beforeEach(async ({ page }) => {
		await page.route(`**/user`, async route => {
			const json = {
				success: true,
				message: 'Get user info successfully.',
				data: {
					username: 'example',
				},
			};
			await route.fulfill({
				json,
			});
		});
		await page.route(`**/user/posts*`, async route => {
			const json = {
				success: true,
				message: `Get user's post list successfully.`,
				data: {
					userPosts: [],
					userPostsCount: 0,
				},
			};
			await route.fulfill({ json });
		});
	});
	test(`should navigate to dashboard page if the "Back to dashboard" link is clicked`, async ({
		page,
	}) => {
		await page.goto('./editor');

		const backToPerviousLink = page.getByRole('link', {
			name: /Back to dashboard/,
		});

		await backToPerviousLink.click();

		await expect(page).toHaveURL(/.*\/posts/);
	});
	test(`should render the PossMainImageUpdate component if the preview-image button is clicked`, async ({
		page,
	}) => {
		await page.goto('./editor');

		const previewImageButton = page.getByRole('button', {
			name: /Click to set image url/,
		});

		await previewImageButton.click();

		const input = page.getByLabel(/Image URL/);

		await expect(input).toBeVisible();
	});
	test(`should preview the main image if the post main image button is clicked`, async ({
		page,
	}) => {
		await page.goto(`./editor`);

		const previewButton = page.getByRole('button', {
			name: /Post main image/,
		});
		const arrowIcon = page.getByTestId('arrow-icon');

		await expect(arrowIcon).toHaveClass(/_right-arrow.* _icon.*/);

		await previewButton.click();

		await expect(arrowIcon).toHaveClass(/.*right-arrow-turn-down.*/);

		const previewImageWrap = page.getByTestId('preview-image-wrap');

		await expect(previewImageWrap).toHaveAttribute('style', /max-height/);
	});
	test(`should display an error message below the title field, if the count of titles exceeds the limit`, async ({
		page,
	}) => {
		await page.goto('./editor');

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill(faker.word.words(30));

		const errorMessage = page.getByText(/Title must be less than \d+ long\./);

		await expect(errorMessage).toBeVisible();
	});
	test(`should display an error message below the content field, if the count of content exceeds the limit`, async ({
		page,
	}) => {
		await page.goto('./editor');

		const contentEditor = page.locator('#editor-content');

		await contentEditor.fill(faker.lorem.paragraphs(80));

		const errorMessage = page.getByText(/Content must be less than \d+ long\./);

		await expect(errorMessage).toBeVisible();
	});
	test(`should display the error messages below the fields if a new post fails to be created`, async ({
		page,
	}) => {
		const mockFields = {
			title: 'error title',
			mainImage: 'error image resource url',
			content: 'error content',
		};

		await page.route(`**/blog/posts`, async route => {
			const json = {
				success: false,
				fields: mockFields,
			};
			await route.fulfill({ json });
		});

		await page.goto('./editor');

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill('new title');

		const titleErrorMessage = page.getByText(mockFields.title);
		const mainImageErrorMessage = page.getByText(mockFields.mainImage);
		const contentErrorMessage = page.getByText(mockFields.content);

		await expect(titleErrorMessage).toBeVisible();
		await expect(mainImageErrorMessage).toBeVisible();
		await expect(contentErrorMessage).toBeVisible();
	});
	test(`should render an error alert if a new post fails to be created`, async ({
		page,
	}) => {
		await page.route(`**/blog/posts`, async route => {
			const json = {
				success: false,
				message: 'server error',
			};
			await route.fulfill({ status: 403, json });
		});

		await page.goto('./editor');

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill('title');

		const errorAlert = page.getByText(/has some errors occur/);

		await expect(errorAlert).toBeVisible();
	});
	test(`should create a post and navigate to '/posts/:postId/editor' path if the fields validation succeeds after automatic submission`, async ({
		page,
	}) => {
		const mockData = {
			_id: '1',
			title: 'new title',
			content: 'new content',
		};

		await page.route(`**/blog/posts`, async route => {
			const json = {
				success: true,
				message: 'Create post successfully.',
				data: mockData,
			};
			await route.fulfill({ json });
		});

		await page.goto('./editor');

		const titleEditor = page.locator('#editor-title');
		const contentEditor = page.locator('#editor-content');

		await titleEditor.fill(mockData.title);
		await contentEditor.fill(mockData.content);

		const alert = page.getByText(/Saving the new post completed./);

		await expect(alert).toBeVisible();

		await expect(page).toHaveURL(new RegExp(`/${mockData._id}/editor`));
	});
	test(`should create a post and navigate to '/posts/:postId/editor' path if the fields validation succeeds after the user clicks the save button`, async ({
		page,
	}) => {
		const mockData = {
			_id: '1',
			title: 'new title',
		};

		await page.route(`**/blog/posts`, async route => {
			const json = {
				success: true,
				message: 'Create post successfully.',
				data: mockData,
			};
			await route.fulfill({ json });
		});

		await page.goto('./editor');

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill(mockData.title);

		const saveButton = page.getByRole('button', { name: /Save Post/ });

		await saveButton.click();

		const alert = page.getByText(/Saving the new post completed./);

		await expect(saveButton).not.toBeVisible();

		await expect(alert).toBeVisible();

		await expect(page).toHaveURL(new RegExp(`posts/${mockData._id}/editor`));
	});
	test(`should prevent the user from adding invalid content images.`, async ({
		page,
	}) => {
		await page.goto(`./editor`);

		const contentEditor = page.locator('#editor-content');

		await contentEditor.click();

		const insertImageButton = page.getByLabel('Insert/edit image');

		await insertImageButton.click();

		const urlInput = page.getByRole('combobox');
		const alertInput = page.getByLabel(/Alternative description/);

		await urlInput.fill('error url');
		await alertInput.fill('test-image');

		const saveButton = page.getByRole('button', { name: 'Save' });

		await saveButton.click();

		const image = page.getByAltText('test-image');
		const alert = page.getByText(/URL is not a valid image source./);

		await expect(alert).toBeVisible();
		await expect(image).not.toBeVisible();
	});
});
