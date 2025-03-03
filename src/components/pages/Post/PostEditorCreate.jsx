// Packages
import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { string } from 'yup';
import isEqual from 'lodash.isequal';

// Styles
import buttonStyles from '../../../styles/button.module.css';
import styles from './PostEditor.module.css';
import imageStyles from '../../../styles/image.module.css';
import formStyles from '../../../styles/form.module.css';

// Utils
import { createPost } from '../../../utils/handlePost';
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

const titleLimit = 100;
const contentLimit = 8000;

const defaultFields = {
	title: '',
	content: '',
	mainImage: '',
};

export const PostEditorCreate = () => {
	const { darkTheme, onAlert, onCreatePost, onActiveModal } =
		useOutletContext();

	const [editorFields, setEditorFields] = useState(defaultFields);
	const [fieldsErrors, setFieldsErrors] = useState({});
	const [previewImage, setPreviewImage] = useState(false);
	const [saving, setSaving] = useState(false);
	const [autoSaving, setAutoSaving] = useState(false);

	const [titleEditorLoad, setTitleEditorLoad] = useState(false);
	const [contentEditorLoad, setContentEditorLoad] = useState(false);
	const [titleLength, setTitleLength] = useState(-1);
	const [contentLength, setContentLength] = useState(-1);

	const imageWrapRef = useRef(null);
	const previewImageWrapRef = useRef(null);
	const timer = useRef(null);
	const titleRef = useRef(null);
	const contentRef = useRef(null);

	const navigate = useNavigate();

	const schema = {
		title: string()
			.trim()
			.test(
				'is-title-over-count',
				`Title must be less than ${titleLimit} long.`,
				() =>
					titleRef.current.plugins.wordcount.body.getCharacterCountWithoutSpaces() <=
					titleLimit,
			),
		content: string()
			.trim()
			.test(
				'is-count-over-count',
				`Content must be less than ${contentLimit} long.`,
				() =>
					contentRef.current.plugins.wordcount.body.getCharacterCountWithoutSpaces() <=
					contentLimit,
			),
	};

	const handlePreview = () => {
		const imageWrapHeight = imageWrapRef.current.clientHeight;

		!previewImage
			? (previewImageWrapRef.current.style.maxHeight = `${imageWrapHeight}px`)
			: (previewImageWrapRef.current.style.maxHeight = '');

		setPreviewImage(!previewImage);
	};

	const handleCreate = async fields => {
		const result = await createPost({ data: fields });

		const handleSuccess = () => {
			onCreatePost(result.data);
			navigate(`/posts/${result.data._id}/editor`);
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

	const handleChange = async (value, name) => {
		const newFields = { ...editorFields, [name]: value };
		const { [name]: _field, ...errors } = fieldsErrors;

		const handleValid = () => {
			setFieldsErrors({});

			!isEqual(newFields, defaultFields) &&
				(timer.current = setTimeout(async () => {
					setAutoSaving(true);
					const result = await createPost({ data: newFields });

					const handleError = () => {
						onAlert({
							message: 'There are some errors occur, please try again later.',
							error: true,
							delay: 3000,
							autosave: true,
						});
						setEditorFields(defaultFields);
					};

					const handleSuccess = async () => {
						onAlert({
							message: 'Autosaving...',
							error: false,
							delay: 1000,
							autosave: true,
						});

						await onCreatePost(result.data);
						navigate(`/posts/${result.data._id}/editor`);
					};

					result.success
						? await handleSuccess()
						: result.fields
							? setFieldsErrors({ ...result.fields })
							: handleError();

					setAutoSaving(false);
				}, 2000));
		};

		setEditorFields(newFields);

		const validationResult = await verifySchema({
			schema,
			data: newFields,
		});

		clearTimeout(timer.current);

		validationResult.success
			? handleValid()
			: setFieldsErrors({ ...errors, ...validationResult.fields });
	};

	const handleSaving = async () => {
		setSaving(true);

		clearTimeout(timer.current);

		const result = await createPost({ data: editorFields });

		const handleError = () => {
			onAlert({
				message: 'There are some errors occur, please try again later.',
				error: true,
				delay: 3000,
			});
			setEditorFields(defaultFields);
		};

		const handleSuccess = async () => {
			onAlert({
				message: 'Save completed.',
				error: false,
				delay: 2000,
			});
			await onCreatePost(result.data);
			navigate(`/posts/${result.data._id}/editor`);
		};

		result.success
			? await handleSuccess()
			: result.fields
				? setFieldsErrors({ ...result.fields })
				: handleError();

		setSaving(false);
	};

	useEffect(() => {
		titleEditorLoad && titleRef.current.focus();
	}, [titleEditorLoad]);

	useEffect(() => {
		return () => clearTimeout(timer.current);
	}, []);

	return (
		<div className={styles.editor}>
			{(!titleEditorLoad || !contentEditorLoad) && (
				<Loading text={'Loading...'} />
			)}
			<div
				data-testid="container"
				className={`${styles.container} ${!titleEditorLoad || !contentEditorLoad ? styles.hide : ''}`}
			>
				<div className={styles['button-container']}>
					<Link to="/" className={styles.link}>
						<span className={`${styles['left-arrow']} ${imageStyles.icon}`} />
						Back to dashboard
					</Link>

					<div className={styles['button-wrap']}>
						{!isEqual(editorFields, defaultFields) && (
							<button
								className={`${styles['save-button']} ${buttonStyles.content} ${buttonStyles.highlight}`}
								onClick={() => !saving && handleSaving()}
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
							setTitleLength(0);
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
									onActiveModal({
										component: (
											<PossMainImageUpdate
												onActiveModal={onActiveModal}
												onSetMainImage={handleChange}
											/>
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
							setContentLength(0);
							setContentEditorLoad(true);
							contentRef.current = editor;
						}}
						onEditorChange={(value, editor) => {
							setContentLength(
								editor.plugins.wordcount.body.getCharacterCountWithoutSpaces(),
							);
							handleChange(value, 'content');
						}}
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
