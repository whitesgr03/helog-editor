import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const randomInteger = (min, max) =>
	Math.floor(Math.random() * (max - min + 1) + min);

const IMAGE_SIZES = [
	{ width: 300, height: 250 },
	{ width: 600, height: 400 },
];

const createParagraph = ({ line, IMAGE_SIZES, error }) => {
	let content = '';

	for (let i = 0; i < line; i++) {
		const size = IMAGE_SIZES[randomInteger(0, IMAGE_SIZES.length - 1)];

		const src = error
			? 'error-url'
			: faker.image.urlPicsumPhotos({
					width: size.width,
					height: size.height,
				});

		content += `<p>${faker.lorem.paragraphs({
			min: 1,
			max: 1,
		})}</p>\n`;

		content += `<p><img style="width:${size.width}px;" src="${src}" alt="Content image" width=${size.width} height=${size.height}></p>`;
	}

	return content;
};

const contentCount = 2;

const userPosts = [
	{
		_id: '0',
		title: faker.book.title(),
		mainImage: faker.image.urlPicsumPhotos({
			width: IMAGE_SIZES[0].width,
			height: IMAGE_SIZES[0].height,
		}),
		content: createParagraph({ line: contentCount, IMAGE_SIZES }),
		publish: false,
		updatedAt: new Date(),
		createdAt: new Date(),
	},
];

test.describe('PostEditorUpdate component', () => {
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
		await page.route(`**/user/posts`, async route => {
			const json = {
				success: true,
				message: `Get user's post list successfully.`,
				data: userPosts,
			};
			await route.fulfill({ json });
		});
		await page.route(`**/blog/posts/*`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: userPosts[0],
			};
			await route.fulfill({ json });
		});
	});

	test(`should navigate to dashboard page if the "Back to dashboard" Link is clicked`, async ({
		page,
	}) => {
		await page.goto(`./${userPosts[0]._id}/editor`);

		const backToPerviousLink = page.getByRole('link', {
			name: /Back to dashboard/,
		});

		await backToPerviousLink.click();

		await expect(page).toHaveURL(/.*\/posts/);
	});
	test(`should render the PossMainImageUpdate component if the preview-image button is clicked`, async ({
		page,
	}) => {
		await page.goto(`./${userPosts[0]._id}/editor`);

		const previewImageButton = page
			.getByRole('button')
			.filter({ has: page.getByAltText('Main Image Preview') });

		await previewImageButton.click();

		const input = page.getByLabel(/Image URL/);

		await expect(input).toBeVisible();
	});
	test(`should preview the main image if the post main image button is clicked`, async ({
		page,
	}) => {
		await page.goto(`./${userPosts[0]._id}/editor`);

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
	test(`should render the post data if the posts context state is provided`, async ({
		page,
	}) => {
		await page.goto(`./${userPosts[0]._id}/editor`);

		const titleEditor = page.getByText(userPosts[0].title);

		await expect(titleEditor).toBeFocused();

		const titleTextCount = page.getByText(/Title word count: \d+/);
		const errorMessage = page.getByText('Message placeholder');
		const mainImage = page.getByAltText('Main Image Preview');
		const contentEditor = page.locator('#editor-content p');
		const contentTextCount = page.getByText(/Content word count: \d+/);

		await expect(titleTextCount).toBeVisible();
		await expect(errorMessage).toHaveCount(2);
		await expect(mainImage).toHaveAttribute('src', userPosts[0].mainImage);
		await expect(contentEditor).toHaveCount(2 * 2);
		await expect(contentTextCount).toBeVisible();
	});
	test(`should display an error message below the title field, if the count of titles exceeds the limit`, async ({
		page,
	}) => {
		await page.goto(`./${userPosts[0]._id}/editor`);

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill(faker.word.words(30));

		const errorMessage = page.getByText(/Title must be less than \d+ long\./);

		await expect(errorMessage).toBeVisible();
	});
	test(`should display an error message below the content field, if the count of content exceeds the limit`, async ({
		page,
	}) => {
		await page.goto(`./${userPosts[0]._id}/editor`);

		const contentEditor = page.locator('#editor-content');

		await contentEditor.fill(faker.lorem.paragraphs(80));

		const errorMessage = page.getByText(/Content must be less than \d+ long\./);

		await expect(errorMessage).toBeVisible();
	});
	test(`should display the error messages below the fields if a specified post fails to be updated`, async ({
		page,
	}) => {
		const mockErrorFields = {
			title: 'error title',
			mainImage: 'error image resource url',
			content: 'error content',
		};

		await page.route(`**/blog/posts/*`, async route => {
			const json = {
				success: false,
				fields: mockErrorFields,
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPosts[0]._id}/editor`);

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill('new title');

		const titleErrorMessage = page.getByText(mockErrorFields.title);
		const mainImageErrorMessage = page.getByText(mockErrorFields.mainImage);
		const contentErrorMessage = page.getByText(mockErrorFields.content);

		await expect(titleErrorMessage).toBeVisible();
		await expect(mainImageErrorMessage).toBeVisible();
		await expect(contentErrorMessage).toBeVisible();
	});
	test(`should render an error alert if a specified post fails to be updated`, async ({
		page,
	}) => {
		await page.route(`**/blog/posts/*`, async route => {
			const json = {
				success: false,
				message: 'server error',
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPosts[0]._id}/editor`);

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill('title');

		const errorAlert = page.getByText(/There are some errors occur/);

		await expect(errorAlert).toBeVisible();
	});
	test(`should update a specified post if the fields validation succeeds after automatic submission`, async ({
		page,
	}) => {
		const mockData = {
			...userPosts[0],
			title: 'new title',
			content: 'new content',
		};

		await page.route(`**/blog/posts/*`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: mockData,
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPosts[0]._id}/editor`);

		const titleEditor = page.locator('#editor-title');
		const contentEditor = page.locator('#editor-content');

		await titleEditor.fill(mockData.title);
		await contentEditor.fill(mockData.content);

		const alert = page.getByText(/Autosaving/);

		await expect(alert).toBeVisible();
	});
	test(`should update a specified post if the fields validation succeeds after the user clicks the save button`, async ({
		page,
	}) => {
		const mockData = {
			...userPosts[0],
			title: 'new title',
		};
		await page.route(`**/user/posts`, async route => {
			const [firstUserPost, ...rest] = userPosts;
			const json = {
				success: true,
				message: `Get user's post list successfully.`,
				data: [{ ...firstUserPost, content: '<p>new content</p>' }, ...rest],
			};
			await route.fulfill({ json });
		});

		await page.route(`**/blog/posts/*`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: mockData,
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPosts[0]._id}/editor`);

		await expect(
			page.getByRole('button', { name: /Save Post/ }),
		).not.toBeVisible();

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill(mockData.title);

		const saveButton = page.getByRole('button', { name: /Save Post/ });

		await saveButton.click();

		const alert = page.getByText(/Save completed/);

		await expect(alert).toBeVisible();
	});
	test(`should display the error messages below the fields with empty values if the user clicks the publish button`, async ({
		page,
	}) => {
		await page.route(`**/user/posts`, async route => {
			const [firstUserPost, ...rest] = userPosts;
			const json = {
				success: true,
				message: `Get user's post list successfully.`,
				data: [
					{ ...firstUserPost, title: '', mainImage: '', content: '' },
					...rest,
				],
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPosts[0]._id}/editor`);

		const publishButton = page.getByRole('button', {
			name: /Published Post/,
		});

		await publishButton.click();

		const titleErrorMessage = page.getByText('Title is required.');
		const mainImageErrorMessage = page.getByText('Main image is required.');
		const contentErrorMessage = page.getByText('Content is required.');

		await expect(titleErrorMessage).toBeVisible();
		await expect(mainImageErrorMessage).toBeVisible();
		await expect(contentErrorMessage).toBeVisible();
	});
	test(`should toggle publish or unpublish if the user clicks the publish button`, async ({
		page,
	}) => {
		const mockData = {
			...userPosts[0],
			title: 'new title',
			content: 'new content',
		};

		await page.route(`**/blog/posts/*`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: mockData,
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPosts[0]._id}/editor`);

		const publishButton = page.getByRole('button', {
			name: /Published Post/,
		});

		await expect(publishButton).toHaveClass(/.*success.*/);

		await publishButton.click();

		const unpublishedButton = page.getByRole('button', {
			name: /Unpublished Post/,
		});

		await expect(unpublishedButton).toHaveClass(/.*error.*/);
	});
	test(`should resize the image if the user drags the image border to resize`, async ({
		page,
	}) => {
		await page.route(`**/blog/posts/*`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: userPosts[0],
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPosts[0]._id}/editor`);

		const image = page.getByAltText('Content image').first();

		const box = await image.boundingBox();

		await page.mouse.click(box.x, box.y);

		await page.mouse.click(box.x, box.y);

		await page.mouse.down();

		await page.mouse.move(box.x - 50, box.y);

		await page.mouse.up();

		await expect(image).toHaveAttribute('style', `width: ${box.width + 50}px;`);
	});
	test(`should prevent the user from adding invalid content images.`, async ({
		page,
	}) => {
		await page.route(`**/user/posts`, async route => {
			const [firstUserPost, ...rest] = userPosts;
			const json = {
				success: true,
				message: `Get user's post list successfully.`,
				data: [{ ...firstUserPost, content: '' }, ...rest],
			};
			await route.fulfill({ json });
		});
		await page.route(`**/blog/posts/*`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: userPosts[0],
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPosts[0]._id}/editor`);

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
