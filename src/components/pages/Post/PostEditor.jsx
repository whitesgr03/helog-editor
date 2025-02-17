// Packages
import { useState, useRef, useEffect } from 'react';
import {
	useOutletContext,
	useNavigate,
	Link,
	useParams,
} from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { string } from 'yup';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';

// Styles
import buttonStyles from '../../../styles/button.module.css';
import styles from './PostEditor.module.css';
import imageStyles from '../../../styles/image.module.css';
import formStyles from '../../../styles/form.module.css';

// Utils
import { createPost, updatePost } from '../../../utils/handlePost';
import { verifySchema } from '../../../utils/verifySchema';

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

export const PostEditor = () => {
	const {
		posts,
		darkTheme,
		onAlert,
		onCreatePost,
		onUpdatePost,
		onActiveModal,
	} = useOutletContext();

	const { postId } = useParams();

	const post = posts.find(post => post._id === postId);

	const default_editor_fields = {
		title: post?.title ?? '',
		mainImage: post?.mainImage ?? '',
		content: post?.content ?? '',
		publish: post?.publish ?? false,
	};

	const [editorFields, setEditorFields] = useState(default_editor_fields);
	const [previousEditorFields, setPreviousEditorFields] = useState(
		default_editor_fields,
	);

	const [fieldsErrors, setFieldsErrors] = useState({});
	const [previewImage, setPreviewImage] = useState(false);
	const [publishing, setPublishing] = useState(false);
	const [saving, setSaving] = useState(false);

	const [titleEditorLoad, setTitleEditorLoad] = useState(false);
	const [contentEditorLoad, setContentEditorLoad] = useState(false);
	const [titleLength, setTitleLength] = useState(-1);
	const [contentLength, setContentLength] = useState(-1);
	const [title, setTitle] = useState(null);
	const [content, setContent] = useState(null);

	const imageWrapRef = useRef(null);
	const previewImageWrapRef = useRef(null);
	const timer = useRef(null);
	const titleRef = useRef(null);

	const navigate = useNavigate();

	const handleShowPreview = () => {
		const imageWrapHeight = imageWrapRef.current.clientHeight;

		!previewImage
			? (previewImageWrapRef.current.style.maxHeight = `${imageWrapHeight}px`)
			: (previewImageWrapRef.current.style.maxHeight = '');

		setPreviewImage(!previewImage);
	};

	const handlePublish = async () => {
		setPublishing(true);

		const newFields = { ...editorFields, publish: !editorFields.publish };

		const result = await updatePost({
			postId,
			data: newFields,
		});

		const handleSuccess = () => {
			setEditorFields(newFields);
			setPreviousEditorFields(newFields);
			setFieldsErrors({});
			onAlert({
				message: `Post has been ${editorFields.publish ? 'UnPublish' : 'Published'}.`,
				error: false,
				delay: 2000,
			});
			onUpdatePost(result.data);
		};

		result.success
			? handleSuccess()
			: result.fields
				? setFieldsErrors({ ...result.fields })
				: onAlert({
						message: 'There are some errors occur, please try again later.',
						error: true,
						delay: 3000,
					});

		setPublishing(false);
	};

	const handleCreate = async fields => {
		const result = await createPost({ data: fields });

		const handleSuccess = () => {
			setPreviousEditorFields(fields);
			onCreatePost(result.data);
			navigate(`${result.data._id}`);
		};

		result.success
			? handleSuccess()
			: result.fields
				? setFieldsErrors({ ...result.fields })
				: onAlert({
						message: 'There are some errors occur, please try again later.',
						error: true,
						delay: 3000,
					});
	};

	const handleUpdate = async fields => {
		const result = await updatePost({ postId, data: fields });

		const handleSuccess = () => {
			setPreviousEditorFields(fields);
			onUpdatePost(result.data);
			setFieldsErrors({});
		};

		result.success
			? handleSuccess()
			: result.fields
				? setFieldsErrors({ ...result.fields })
				: onAlert({
						message: 'There are some errors occur, please try again later.',
						error: true,
						delay: 3000,
					});
	};

	const handleSetMainImage = url => {
		timer.current && clearTimeout(timer.current);

		const newFields = { ...editorFields, mainImage: url };
		const { mainImage, ...rest } = fieldsErrors;

		setFieldsErrors({ ...rest });
		setEditorFields(newFields);

		timer.current = setTimeout(async () => {
			postId ? await handleUpdate(newFields) : await handleCreate(newFields);

			onAlert({
				message: 'Autosaving...',
				error: false,
				delay: 1000,
				autosave: true,
			});
		}, 2000);
	};

	const handleChangeTitle = (value, editor) => {
		timer.current && clearTimeout(timer.current);

		const limit = 100;
		const wordCount = editor.getContent().length;

		const { title, ...errors } = fieldsErrors;

		setFieldsErrors({ ...errors });
		setTitleLength(wordCount);

		const handleValidation = async () => {
			const newFields = { ...editorFields, title: value };

			setEditorFields(newFields);

			const schema = {
				title: string()
					.trim()
					.when('$publish', ([publish], schema) =>
						publish ? schema.required('Title is required.') : schema,
					),
			};

			const validationResult = await verifySchema({
				schema,
				data: newFields,
				context: { publish: editorFields.publish },
			});

			const handleInValid = () => {
				setFieldsErrors({ ...errors, ...validationResult.fields });
			};

			const handleValid = async () => {
				timer.current = setTimeout(async () => {
					postId
						? await handleUpdate(newFields)
						: await handleCreate(newFields);
					onAlert({
						message: 'Autosaving...',
						error: false,
						delay: 2000,
						autosave: true,
					});
				}, 2000);
			};

			validationResult.success ? handleValid() : handleInValid();
		};

		previousEditorFields.title !== value
			? wordCount > limit
				? setFieldsErrors({
						...errors,
						title: `Title must be less than ${limit} long.`,
					})
				: handleValidation()
			: setEditorFields(previousEditorFields);
	};

	const handleChangeContent = (value, editor) => {
		timer.current && clearTimeout(timer.current);

		const limit = 8000;
		const wordCount = editor.getContent({ format: 'text' }).length;
		const { content, ...errors } = fieldsErrors;

		setFieldsErrors({ ...errors });
		setContentLength(wordCount);

		const handleValidation = async () => {
			const newFields = { ...editorFields, content: value };

			setEditorFields(newFields);

			const schema = {
				content: string()
					.trim()
					.when('$publish', ([publish], schema) =>
						publish ? schema.required('Content is required.') : schema,
					),
			};

			const validationResult = await verifySchema({
				schema,
				data: newFields,
				context: { publish: editorFields.publish },
			});

			const handleInValid = () => {
				setFieldsErrors({ ...errors, ...validationResult.fields });
			};

			const handleValid = () => {
				timer.current = setTimeout(async () => {
					postId
						? await handleUpdate(newFields)
						: await handleCreate(newFields);
					onAlert({
						message: 'Autosaving...',
						error: false,
						delay: 2000,
						autosave: true,
					});
				}, 2000);
			};

			validationResult.success ? handleValid() : handleInValid();
		};

		previousEditorFields.content !== value
			? wordCount > limit
				? setFieldsErrors({
						...errors,
						content: `Content must be less than ${limit} long.`,
					})
				: handleValidation()
			: setEditorFields(previousEditorFields);
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
				onAlert({
					message: 'URL is not a valid image source.',
					error: true,
					delay: 3000,
				});
				target.remove();
				document.activeElement.blur();
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

	const handleSaving = async () => {
		setSaving(true);

		timer.current && clearTimeout(timer.current);

		postId
			? await handleUpdate(editorFields)
			: await handleCreate(editorFields);
		onAlert({
			message: 'Saving...',
			error: false,
			delay: 2000,
		});
		setSaving(false);
	};

	useEffect(() => {
		const handleFocusTitle = () => {
			titleRef.current.selection.select(titleRef.current.getBody(), true);
			titleRef.current.selection.collapse(false);
			titleRef.current.focus();
		};
		title !== null && handleFocusTitle();
	}, [title]);

	useEffect(() => {
		return () => clearTimeout(timer.current);
	});

	return (
		<div className={styles.editor}>
			{(!titleEditorLoad || !contentEditorLoad) && (
				<Loading text={'Loading...'} />
			)}
			<div
				className={`${styles.container} ${!titleEditorLoad || !contentEditorLoad ? styles.hide : ''}`}
			>
				<div className={styles['button-container']}>
					<Link to="/" className={styles.link}>
						<span className={`${styles['left-arrow']} ${imageStyles.icon}`} />
						Back to dashboard
					</Link>

					<div className={styles['button-wrap']}>
						{!isEqual(previousEditorFields, editorFields) && (
							<button
								className={`${styles['save-button']} ${buttonStyles.content} ${buttonStyles.highlight}`}
								onClick={() =>
									!saving && isEmpty(fieldsErrors) && handleSaving()
								}
							>
								<span className={buttonStyles.text}>
									{saving ? (
										<>
											Saving
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

						{postId && (
							<button
								className={`${styles['publish-button']} ${buttonStyles.content} ${editorFields.publish ? buttonStyles.error : buttonStyles.success}`}
								onClick={() => !publishing && handlePublish()}
							>
								<span className={buttonStyles.text}>
									{publishing ? (
										<>
											{editorFields.publish ? 'Unpublishing' : 'Publishing'}
											<span
												className={`${imageStyles.icon} ${buttonStyles['load']}`}
											/>
										</>
									) : (
										<>
											{editorFields.publish ? 'Unpublished' : 'Published'} Post
										</>
									)}
								</span>
							</button>
						)}
					</div>
				</div>
				<div className={styles.wrap}>
					<Editor
						id="editor-title"
						key={darkTheme}
						tinymceScriptSrc="/tinymce/tinymce.min.js"
						initialValue={title ?? ''}
						licenseKey="gpl"
						tagName="h2"
						onInit={(_evt, editor) => {
							setTitle(post?.title ?? '');
							setTitleLength(editor.getContent().length);
							setTitleEditorLoad(true);
							titleRef.current = editor;
						}}
						onEditorChange={handleChangeTitle}
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
						<button
							className={styles['preview-title']}
							onClick={handleShowPreview}
						>
							Post main image
							<span
								className={`${styles['right-arrow']} ${previewImage ? styles['right-arrow-turn-down'] : ''} ${imageStyles.icon}`}
							/>
						</button>
						<div
							className={styles['preview-image-wrap']}
							ref={previewImageWrapRef}
						>
							<button
								className={styles['preview-image']}
								ref={imageWrapRef}
								onClick={() =>
									onActiveModal({
										component: (
											<PossMainImageUpdate
												onActiveModal={onActiveModal}
												onSetMainImage={handleSetMainImage}
											/>
										),
									})
								}
							>
								{editorFields.mainImage === '' ? (
									<div className={styles['image-wrap']}>
										<span>Click to set image url</span>
									</div>
								) : (
									<img
										className={styles.image}
										src={editorFields.mainImage}
										alt="Main Image Preview"
									/>
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
						initialValue={content ?? ''}
						onInit={(_evt, editor) => {
							setContent(post?.content ?? '');
							setContentLength(editor.getContent().length);
							setContentEditorLoad(true);
						}}
						onEditorChange={handleChangeContent}
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
