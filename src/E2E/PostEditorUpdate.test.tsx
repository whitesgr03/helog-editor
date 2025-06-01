import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const randomInteger = (min, max) =>
	Math.floor(Math.random() * (max - min + 1) + min);

const IMAGE_SIZES: { width: number; height: number }[] = [
	{ width: 300, height: 250 },
	{ width: 600, height: 400 },
];

const createParagraph = ({
	line,
	IMAGE_SIZES,
}: {
	line: number;
	IMAGE_SIZES: { width: number; height: number }[];
}) => {
	let content = '';

	for (let i = 0; i < line; i++) {
		const size = IMAGE_SIZES[randomInteger(0, IMAGE_SIZES.length - 1)];

		const src = faker.image.urlPicsumPhotos({
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

const userPost = {
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
};

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

		await page.route(`**/user/posts*`, async route => {
			const json = {
				success: true,
				message: `Get user's post list successfully.`,
				data: {
					userPosts: [userPost],
					userPostsCount: 1,
				},
			};
			await route.fulfill({ json });
		});

		await page.route(`**/user/posts/${userPost._id}`, async route => {
			const json = {
				success: true,
				message: 'Get post successfully.',
				data: userPost,
			};
			await route.fulfill({ json });
		});
	});

	test(`should navigate to dashboard page if the "Back to dashboard" link is clicked`, async ({
		page,
	}) => {
		await page.goto(`./${userPost._id}/editor`);

		const backToPerviousLink = page.getByRole('link', {
			name: /Back to dashboard/,
		});

		await backToPerviousLink.click();

		await expect(page).toHaveURL(/.*\/posts/);
	});
	test(`should render the PossMainImageUpdate component if the preview-image button is clicked`, async ({
		page,
	}) => {
		await page.goto(`./${userPost._id}/editor`);

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
		await page.goto(`./${userPost._id}/editor`);

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
	test(`should render the post data if fetching post data is successfully`, async ({
		page,
	}) => {
		await page.goto(`./${userPost._id}/editor`);

		const titleEditor = page.getByText(userPost.title);

		await expect(titleEditor).toBeFocused();

		const titleTextCount = page.getByText(/Title word count: \d+/);
		const errorMessage = page.getByText('Message placeholder');
		const mainImage = page.getByAltText('Main Image Preview');
		const contentEditor = page.locator('#editor-content p');
		const contentTextCount = page.getByText(/Content word count: \d+/);

		await expect(titleTextCount).toBeVisible();
		await expect(errorMessage).toHaveCount(2);
		await expect(mainImage).toHaveAttribute('src', userPost.mainImage);
		await expect(contentEditor).toHaveCount(2 * 2);
		await expect(contentTextCount).toBeVisible();
	});
	test(`should display an error message below the title field, if the count of titles exceeds the limit`, async ({
		page,
	}) => {
		await page.goto(`./${userPost._id}/editor`);

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill(faker.word.words(30));

		const errorMessage = page.getByText(/Title must be less than \d+ long\./);

		await expect(errorMessage).toBeVisible();
	});
	test(`should display an error message below the content field, if the count of content exceeds the limit`, async ({
		page,
	}) => {
		await page.goto(`./${userPost._id}/editor`);

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

		await page.goto(`./${userPost._id}/editor`);

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill('new title');

		const titleErrorMessage = page.getByText(mockErrorFields.title);
		const mainImageErrorMessage = page.getByText(mockErrorFields.mainImage);
		const contentErrorMessage = page.getByText(mockErrorFields.content);

		await expect(titleErrorMessage).toBeVisible();
		await expect(mainImageErrorMessage).toBeVisible();
		await expect(contentErrorMessage).toBeVisible();
	});
	test(`should render an error alert if the post automatic update fails`, async ({
		page,
	}) => {
		await page.route(`**/blog/posts/${userPost._id}`, async route => {
			const json = {
				success: false,
				message: 'server error',
			};
			await route.fulfill({ status: 500, json });
		});

		await page.goto(`./${userPost._id}/editor`);

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill('title');

		const errorAlert = page.getByText(
			/Editing the post has some errors occur, please try again later./,
		);

		await expect(errorAlert).toBeVisible();
	});
	test(`should update the post if the fields validation succeeds after automatic submission`, async ({
		page,
	}) => {
		const mockData = {
			...userPost,
			title: 'new title',
			content: 'new content',
		};

		await page.route(`**/blog/posts/${userPost._id}`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: mockData,
			};
			await route.fulfill({ json });
		});

		await page.goto(`./`);

		await expect(page.getByText(userPost.title)).toBeVisible();

		await page.goto(`./${userPost._id}/editor`);

		const titleEditor = page.locator('#editor-title');
		const contentEditor = page.locator('#editor-content');

		await titleEditor.fill(mockData.title);
		await contentEditor.fill(mockData.content);

		const alert = page.getByText(/Saving the post completed./);

		await expect(alert).toBeVisible();
	});
	test(`should update a specified post if the fields validation succeeds after the user clicks the save button`, async ({
		page,
	}) => {
		const mockData = {
			...userPost,
			title: 'new title',
		};

		await page.route(`**/blog/posts/${userPost._id}`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: mockData,
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPost._id}/editor`);

		const titleEditor = page.locator('#editor-title');

		await titleEditor.fill(mockData.title);

		const saveButton = page.getByRole('button', { name: /Save Post/ });

		await saveButton.click();

		const alert = page.getByText(/Saving the post completed./);

		await expect(alert).toBeVisible();
	});
	test(`should display the error messages if the user clicks the publish button and the fields validation fails`, async ({
		page,
	}) => {
		await page.route(`**/user/posts/${userPost._id}`, async route => {
			const json = {
				success: true,
				message: 'Get post successfully.',
				data: { ...userPost, title: '', mainImage: '', content: '' },
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPost._id}/editor`);

		const publishButton = page.getByRole('button', {
			name: /Switch to Published/,
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
			...userPost,
			publish: !userPost.publish,
		};

		await page.route(`**/blog/posts/*`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: mockData,
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPost._id}/editor`);

		const publishButton = page.getByRole('button', {
			name: /Switch to Published/,
		});

		await expect(publishButton).toHaveClass(/.*success.*/);

		await publishButton.click();

		const unpublishedButton = page.getByRole('button', {
			name: /Switch to Unpublished/,
		});

		await expect(unpublishedButton).toHaveClass(/.*error.*/);
	});
	test(`should prevent the user from adding invalid content images.`, async ({
		page,
	}) => {
		await page.route(`**/user/posts/${userPost._id}`, async route => {
			const json = {
				success: true,
				message: `Get user's post list successfully.`,
				data: [{ ...userPost, content: '' }],
			};
			await route.fulfill({ json });
		});

		await page.route(`**/blog/posts/${userPost._id}`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: userPost,
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPost._id}/editor`);

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
	test(`should resize the image if the user drags the image border to resize`, async ({
		page,
	}) => {
		await page.route(`**/blog/posts/*`, async route => {
			const json = {
				success: true,
				message: 'Update post successfully.',
				data: userPost,
			};
			await route.fulfill({ json });
		});

		await page.goto(`./${userPost._id}/editor`);

		const image = page.getByAltText('Content image').first();

		const box = await image.boundingBox();

		await page.mouse.click(box?.x ?? 0, box?.y ?? 0);

		await page.mouse.click(box?.x ?? 0, box?.y ?? 0);

		await page.mouse.down();

		await page.mouse.move((box?.x ?? 0) - 50, box?.y ?? 0);

		await page.mouse.up();

		await expect(image).toHaveAttribute(
			'style',
			`width: ${(box?.width ?? 0) + 50}px;`,
		);
	});
});
