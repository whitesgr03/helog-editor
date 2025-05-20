// Packages
import { useState, useRef, useEffect } from 'react';
import {
	useOutletContext,
	Link,
	useParams,
	Navigate,
	useLocation,
} from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { string, boolean } from 'yup';
import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import { useMutation, useQuery } from '@tanstack/react-query';

// Styles
import buttonStyles from '../../../styles/button.module.css';
import styles from './PostEditor.module.css';
import imageStyles from '../../../styles/image.module.css';
import formStyles from '../../../styles/form.module.css';

// Utils
import { updatePost } from '../../../utils/handlePost';
import { verifySchema } from '../../../utils/verifySchema';
import {
	queryClient,
	queryPostDetailOption,
} from '../../../utils/queryOptions';

// Components
import { Loading } from '../../utils/Loading';
import { PossMainImageUpdate } from './PossMainImageUpdate';

// Variables
const EDITOR_TITLE_INIT = {
	entity_encoding: 'raw',
	placeholder: 'The post title...',
	menubar: false,
	toolbar: false,
	inline: true,
	plugins: 'wordcount',
	paste_as_text: true,
};
const EDITOR_CONTENT_INIT = {
	placeholder: 'The post content...',
	inline: true,
	menubar: false,
	toolbar: false,
	plugins: ['quickbars', 'image', 'codesample', 'link', 'lists', 'wordcount'],
	paste_as_text: true,

	quickbars_selection_toolbar: 'bold italic link blocks blockquote',
	link_default_target: '_blank',
	link_assume_external_targets: 'https',
	link_context_toolbar: true,
	link_title: false,
	block_formats: 'Large=h3; Normal=p; Small=h5',

	quickbars_insert_toolbar: 'bullist numlist image codesample hr',
	quickbars_image_toolbar: 'image',
	image_uploadtab: false,
	typeahead_urls: false,
};

// Context
import { useAppDataAPI } from '../App/AppContext';

const titleLimit = 100;
const contentLimit = 8000;

export const PostEditorUpdate = () => {
	const { darkTheme } = useOutletContext();
	const { onAlert, onModal } = useAppDataAPI();

	const { postId } = useParams();
	const { pathname: previousPath } = useLocation();

	const {
		isFetching,
		isError,
		data: post,
		error,
	} = useQuery({ ...queryPostDetailOption(postId) });

	const defaultFields = {
		title: post?.title,
		mainImage: post?.mainImage,
		content: post?.content,
		publish: post?.publish,
	};

	const [editorFields, setEditorFields] = useState({});
	const [fieldsErrors, setFieldsErrors] = useState({});
	const [previewImage, setPreviewImage] = useState(false);
	const [publishing, setPublishing] = useState(false);

	const [titleEditorLoad, setTitleEditorLoad] = useState(false);
	const [contentEditorLoad, setContentEditorLoad] = useState(false);
	const [titleLength, setTitleLength] = useState(-1);
	const [contentLength, setContentLength] = useState(-1);

	const imageWrapRef = useRef(null);
	const previewImageWrapRef = useRef(null);
	const timer = useRef(null);
	const titleRef = useRef(null);
	const contentRef = useRef(null);

	const { isPending, mutate } = useMutation({
		mutationFn: updatePost,
		onError: () => {
			onAlert({
				message:
					'Editing the post has some errors occur, please try again later.',
				error: true,
				delay: 4000,
				autosave: true,
			});
			publishing && setEditorFields(defaultFields);
		},
		onSuccess: response => {
			const handleRefetchComments = () => {
				queryClient.setQueryData(['userPosts'], oldData => {
					const { author, mainImage, content, ...updatedPost } = response.data;
					const newPages = oldData.pages.map(page => ({
						...page,
						data: {
							...page.data,
							userPosts: page.data.userPosts.map(post =>
								post._id === postId ? updatedPost : post,
							),
						},
					}));
					return {
						pages: newPages,
						pageParams: oldData.pageParams,
					};
				});
				queryClient.setQueryData(['userPost', postId], response);
				onAlert({
					message: publishing
						? `Post is ${editorFields.publish ? 'published' : 'unpublished'}.`
						: 'Saving the post completed.',
					error: false,
					delay: 2000,
					autosave: true,
				});
			};

			response.success
				? handleRefetchComments()
				: setFieldsErrors({ ...response.fields });
		},
		onSettled: () => publishing && setPublishing(false),
	});

	const schema = {
		publish: boolean(),
		title: string()
			.trim()
			.test(
				'is-title-over-count',
				`Title must be less than ${titleLimit} long.`,
				() =>
					titleRef.current.plugins.wordcount.body.getCharacterCountWithoutSpaces() <=
					titleLimit,
			)
			.when('publish', ([publish], schema) =>
				publish ? schema.required('Title is required.') : schema,
			),
		mainImage: string()
			.trim()
			.when('publish', ([publish], schema) =>
				publish ? schema.required('Main image is required.') : schema,
			),
		content: string()
			.trim()
			.test(
				'is-count-over-count',
				`Content must be less than ${contentLimit} long.`,
				() =>
					contentRef.current.plugins.wordcount.body.getCharacterCountWithoutSpaces() <=
					contentLimit,
			)
			.when('publish', ([publish], schema) =>
				publish ? schema.required('Content is required.') : schema,
			),
	};

	const handlePreview = () => {
		const imageWrapHeight = imageWrapRef.current.clientHeight;

		!previewImage
			? (previewImageWrapRef.current.style.maxHeight = `${imageWrapHeight}px`)
			: (previewImageWrapRef.current.style.maxHeight = '');

		setPreviewImage(!previewImage);
	};

	const handleResizeImageSize = evt => {
		evt.target.setAttribute('style', `width:${evt.width}px;`);
	};

	const handleContentImages = (evt, editor) => {
		const target = evt.element;
		const value = editor.getContent();
		const handleCheckMimeTypes = () => {
			const isSetStyle = target.hasAttribute('style');
			const width = target.getAttribute('width');

			!isSetStyle && target.setAttribute('style', `width:${width}px;`);

			const image = new Image();
			const handleError = () => {
				document.activeElement.blur();
				onAlert({
					message: 'URL is not a valid image source.',
					error: true,
					delay: 3000,
				});
				target.remove();
			};
			image.onerror = handleError;

			image.onload = () =>
				(image.width <= 0 || image.height <= 0) && handleError();

			image.src = target.src;
		};
		target.nodeName === 'IMG' &&
			value !== editorFields.content &&
			handleCheckMimeTypes();
	};

	const handlePublish = async () => {
		setPublishing(true);
		clearTimeout(timer.current);

		const newFields = { ...editorFields, publish: !editorFields.publish };

		const handleValid = () => {
			setEditorFields(newFields);
			mutate({ postId, data: newFields });
		};

		const handleInValid = () => {
			setFieldsErrors({ ...fieldsErrors, ...validationResult.fields });
			setPublishing(false);
		};

		const validationResult = await verifySchema({
			schema,
			data: newFields,
		});

		validationResult.success ? handleValid() : handleInValid();
	};

	const handleChange = async (value, name) => {
		const newFields = { ...editorFields, [name]: value };
		const { [name]: _field, ...errors } = fieldsErrors;

		clearTimeout(timer.current);

		setEditorFields(newFields);

		const handleValid = () => {
			setFieldsErrors({});

			!isEqual(newFields, defaultFields) &&
				(timer.current = setTimeout(() => {
					mutate({ postId, data: newFields });
				}, 2000));
		};

		const validationResult = await verifySchema({
			schema,
			data: newFields,
		});

		validationResult.success
			? handleValid()
			: setFieldsErrors({ ...errors, ...validationResult.fields });
	};

	const handleSaving = () => {
		clearTimeout(timer.current);
		mutate({ postId, data: editorFields });
	};

	useEffect(() => {
		const handleFocusTitle = () => {
			titleRef.current.selection.select(titleRef.current.getBody(), true);
			titleRef.current.selection.collapse(false);
			titleRef.current.focus();
		};
		titleEditorLoad && handleFocusTitle();
	}, [titleEditorLoad]);

	useEffect(() => {
		return () => clearTimeout(timer.current);
	}, []);

	useEffect(() => {
		post &&
			isEmpty(editorFields) &&
			setEditorFields({
				title: post.title,
				mainImage: post.mainImage,
				content: post.content,
				publish: post.publish,
			});
	}, [post, editorFields]);

	return (
		<div className={styles.editor}>
			{isError ? (
				error.cause?.status === 404 ? (
					<Navigate to="/error/404" />
				) : (
					<Navigate
						to="/error"
						state={{
							previousPath,
						}}
					/>
				)
			) : (
				(isFetching || !titleEditorLoad || !contentEditorLoad) && (
					<Loading text={'Loading post ...'} />
				)
			)}
			<div
				data-testid="container"
				className={`${styles.container} ${isFetching || !titleEditorLoad || !contentEditorLoad ? styles.hide : ''}`}
			>
				<div className={styles['button-container']}>
					<Link to="/posts" className={styles.link}>
						<span className={`${styles['left-arrow']} ${imageStyles.icon}`} />
						Back to dashboard
					</Link>

					<div className={styles['button-wrap']}>
						{!publishing && !isEqual(editorFields, defaultFields) && (
							<button
								className={`${styles['save-button']} ${buttonStyles.content} ${buttonStyles.more}`}
								onClick={() => !isPending && handleSaving()}
							>
								<span className={buttonStyles.text}>
									{isPending ? (
										<>
											Saving ...
											<span
												className={`${imageStyles.icon} ${buttonStyles['load']}`}
											/>
										</>
									) : (
										<>Save Post</>
									)}
								</span>
							</button>
						)}
						<button
							className={`${styles['publish-button']} ${buttonStyles.content} ${editorFields.publish ? buttonStyles.error : buttonStyles.success}`}
							onClick={() => !publishing && handlePublish()}
						>
							<span className={buttonStyles.text}>
								Switch to {editorFields.publish ? 'Unpublished' : 'Published'}
								{publishing && (
									<span
										className={`${imageStyles.icon} ${buttonStyles['load']}`}
									/>
								)}
							</span>
						</button>
					</div>
				</div>
				<div className={styles.wrap}>
					<Editor
						id="editor-title"
						key={darkTheme}
						tinymceScriptSrc="/tinymce/tinymce.min.js"
						licenseKey="gpl"
						tagName="h2"
						value={editorFields.title}
						onInit={(_evt, editor) => {
							setTitleLength(
								editor.plugins.wordcount.body.getCharacterCountWithoutSpaces(),
							);
							setTitleEditorLoad(true);
							titleRef.current = editor;
						}}
						onEditorChange={(value, editor) => {
							setTitleLength(
								editor.plugins.wordcount.body.getCharacterCountWithoutSpaces(),
							);
							handleChange(value, 'title');
						}}
						init={{
							...EDITOR_TITLE_INIT,
							skin: darkTheme ? 'oxide-dark' : 'oxide',
						}}
					/>
					<div className={styles['error-message-wrap']}>
						<div
							className={`${formStyles['error-message']} ${fieldsErrors.title ? formStyles['error-message-show'] : formStyles['error-message-no-display']}`}
						>
							<span className={`${imageStyles.icon} ${formStyles.alert}`} />
							<span className={formStyles.placeholder}>
								{fieldsErrors.title ?? 'Message placeholder'}
							</span>
						</div>

						{titleLength > -1 && (
							<div className={styles.count}>
								Title word count: {titleLength}
							</div>
						)}
					</div>
				</div>
				<div className={styles.wrap}>
					<div className={styles['preview']}>
						<button className={styles['preview-title']} onClick={handlePreview}>
							Post main image
							<span
								data-testid="arrow-icon"
								className={`${styles['right-arrow']} ${previewImage ? styles['right-arrow-turn-down'] : ''} ${imageStyles.icon}`}
							/>
						</button>
						<div
							className={styles['preview-image-wrap']}
							ref={previewImageWrapRef}
							data-testid="preview-image-wrap"
						>
							<button
								className={styles['preview-image']}
								ref={imageWrapRef}
								tabIndex={previewImage ? 0 : -1}
								onClick={() =>
									onModal({
										component: (
											<PossMainImageUpdate onSetMainImage={handleChange} />
										),
									})
								}
							>
								{editorFields.mainImage ? (
									<img
										className={styles.image}
										src={editorFields.mainImage}
										alt="Main Image Preview"
									/>
								) : (
									<div className={styles['image-wrap']}>
										<span>Click to set image url</span>
									</div>
								)}
							</button>
						</div>
					</div>

					{fieldsErrors.mainImage && (
						<div
							className={`${formStyles['error-message']} ${formStyles['error-message-show']}`}
						>
							<span className={`${imageStyles.icon} ${formStyles.alert}`} />
							<span className={formStyles.placeholder}>
								{fieldsErrors.mainImage}
							</span>
						</div>
					)}
				</div>
				<div className={styles.wrap}>
					<Editor
						id="editor-content"
						tinymceScriptSrc="/tinymce/tinymce.min.js"
						licenseKey="gpl"
						value={editorFields.content}
						onInit={(_evt, editor) => {
							setContentLength(
								editor.plugins.wordcount.body.getCharacterCountWithoutSpaces(),
							);
							setContentEditorLoad(true);
							contentRef.current = editor;
						}}
						onEditorChange={(value, editor) => {
							setContentLength(
								editor.plugins.wordcount.body.getCharacterCountWithoutSpaces(),
							);
							handleChange(value, 'content');
						}}
						onObjectResized={handleResizeImageSize}
						onNodeChange={handleContentImages}
						init={EDITOR_CONTENT_INIT}
					/>
					<div className={styles['error-message-wrap']}>
						<div
							className={`${formStyles['error-message']} ${fieldsErrors.content ? formStyles['error-message-show'] : formStyles['error-message-no-display']}`}
						>
							<span className={`${imageStyles.icon} ${formStyles.alert}`} />
							<span className={formStyles.placeholder}>
								{fieldsErrors.content ?? 'Message placeholder'}
							</span>
						</div>
						{contentLength > -1 && (
							<div className={styles.count}>
								Content word count: {contentLength}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
