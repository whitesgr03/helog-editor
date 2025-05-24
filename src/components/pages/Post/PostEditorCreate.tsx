// Packages
import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { string } from 'yup';
import isEqual from 'lodash.isequal';
import { useMutation } from '@tanstack/react-query';
import { Editor as TinyMCEEditor } from 'tinymce';

// Styles
import buttonStyles from '../../../styles/button.module.css';
import styles from './PostEditor.module.css';
import imageStyles from '../../../styles/image.module.css';
import formStyles from '../../../styles/form.module.css';

// Utils
import { createPost } from '../../../utils/handlePost';
import { verifySchema } from '../../../utils/verifySchema';
import { queryClient } from '../../../utils/queryOptions';

// Components
import { Loading } from '../../utils/Loading';
import { PossMainImageUpdate } from './PossMainImageUpdate';

// Variables
const EDITOR_TITLE_INIT = {
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

// Type
import { DarkTheme } from '../App/App';

interface inputErrors {
	title?: string;
	mainImage?: string;
	content?: string;
}

export type handleChange = {
	value: string;
	name: 'title' | 'mainImage' | 'content';
};

const titleLimit = 100;
const contentLimit = 8000;

const defaultFields = {
	title: '',
	content: '',
	mainImage: '',
};

export const PostEditorCreate = () => {
	const { darkTheme }: { darkTheme: DarkTheme } = useOutletContext();
	const { onAlert, onModal } = useAppDataAPI();
	const [editorFields, setEditorFields] = useState(defaultFields);
	const [fieldsErrors, setFieldsErrors] = useState<inputErrors>({});
	const [previewImage, setPreviewImage] = useState(false);

	const [titleEditorLoad, setTitleEditorLoad] = useState(false);
	const [contentEditorLoad, setContentEditorLoad] = useState(false);
	const [titleLength, setTitleLength] = useState(-1);
	const [contentLength, setContentLength] = useState(-1);

	const imageWrapRef = useRef<HTMLButtonElement>(null);
	const previewImageWrapRef = useRef<HTMLDivElement>(null);
	const timer = useRef<NodeJS.Timeout>();
	const titleRef = useRef<TinyMCEEditor | null>(null);
	const contentRef = useRef<TinyMCEEditor | null>(null);

	const navigate = useNavigate();

	const { isPending, mutate } = useMutation({
		mutationFn: createPost,
		onError: () => {
			onAlert([
				{
					message:
						'Saving the new post has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]);
			setEditorFields(defaultFields);
		},
		onSuccess: response => {
			const handleRefetchUserPosts = () => {
				queryClient.invalidateQueries({ queryKey: ['userPosts'] });
				queryClient.setQueryData(['userPost', response.data._id], response);
				onAlert([
					{
						message: 'Saving the new post completed.',
						error: false,
						delay: 2000,
					},
				]);
				navigate(`/posts/${response.data._id}/editor`);
			};
			response.success
				? handleRefetchUserPosts()
				: setFieldsErrors({ ...response.fields });
		},
	});

	const schema = {
		title: string()
			.trim()
			.test(
				'is-title-over-count',
				`Title must be less than ${titleLimit} long.`,
				() =>
					titleRef.current?.plugins.wordcount.body.getCharacterCountWithoutSpaces() <=
					titleLimit,
			),
		content: string()
			.trim()
			.test(
				'is-count-over-count',
				`Content must be less than ${contentLimit} long.`,
				() =>
					contentRef.current?.plugins.wordcount.body.getCharacterCountWithoutSpaces() <=
					contentLimit,
			),
	};

	const handlePreview = () => {
		const imageWrapHeight = imageWrapRef.current?.clientHeight;
		const previewImageWrap = previewImageWrapRef.current;

		previewImageWrap &&
			(!previewImage
				? (previewImageWrap.style.maxHeight = `${imageWrapHeight}px`)
				: (previewImageWrap.style.maxHeight = ''));

		setPreviewImage(!previewImage);
	};

	const handleChange = async (
		value: handleChange['value'],
		name: handleChange['name'],
	) => {
		const newFields = { ...editorFields, [name]: value };

		const { [name]: _field, ...errors } = fieldsErrors;

		const handleValid = () => {
			setFieldsErrors({});

			!isEqual(newFields, defaultFields) &&
				(timer.current = setTimeout(async () => {
					mutate({ data: newFields });
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
		clearTimeout(timer.current);
		mutate({ data: editorFields });
	};

	useEffect(() => {
		titleEditorLoad && titleRef.current?.focus();
	}, [titleEditorLoad]);

	useEffect(() => {
		return () => clearTimeout(timer.current);
	}, []);

	return (
		<div className={styles.editor}>
			{(!titleEditorLoad || !contentEditorLoad) && (
				<Loading text={'Loading editor...'} />
			)}
			<div
				data-testid="container"
				className={`${styles.container} ${!titleEditorLoad || !contentEditorLoad ? styles.hide : ''}`}
			>
				<div className={styles['button-container']}>
					<Link to="/posts" className={styles.link}>
						<span className={`${styles['left-arrow']} ${imageStyles.icon}`} />
						Back to dashboard
					</Link>

					<div className={styles['button-wrap']}>
						{!isEqual(editorFields, defaultFields) && (
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
					</div>
				</div>
				<div className={styles.wrap}>
					<Editor
						id="editor-title"
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
							entity_encoding: 'raw',
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
						onNodeChange={(e, editor) => {
							const target = e.element as HTMLImageElement;
							const value = editor.getContent();

							const handleCheckMimeTypes = () => {
								const isSetStyle = target.hasAttribute('style');
								const width = target.getAttribute('width');

								!isSetStyle &&
									target.setAttribute('style', `width:${width}px;`);

								const image = new Image();
								const handleError = () => {
									document.activeElement instanceof HTMLElement &&
										document.activeElement.blur();
									onAlert([
										{
											message: 'URL is not a valid image source.',
											error: true,
											delay: 3000,
										},
									]);
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
