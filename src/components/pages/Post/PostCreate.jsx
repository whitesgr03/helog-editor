// Packages
import { useState, useRef, useEffect } from 'react';
import {
	useOutletContext,
	useNavigate,
	useLocation,
	Link,
} from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import isEqual from 'lodash.isequal';

// Styles
import buttonStyles from '../../../styles/button.module.css';
import styles from './PostCreate.module.css';
import imageStyles from '../../../styles/image.module.css';

// Utils
import { createPost, updatePost } from '../../../utils/handlePost';
import { escaping } from '../../../utils/handleEscape';

// Components
import { Loading } from '../../utils/Loading';

// Variables
const editorContentInit = {
	selection_toolbar: {
		quickbars_selection_toolbar: 'bold italic link blocks blockquote',
		link_default_target: '_blank',
		link_assume_external_targets: 'https',
		link_context_toolbar: true,
		link_title: false,
		block_formats: 'Large=h3; Normal=p; Small=h5',
	},
	insert_toolbar: {
		quickbars_insert_toolbar: 'bullist numlist image codesample hr',
		image_uploadtab: false,
		typeahead_urls: false,
	},
	image_toolbar: {
		quickbars_image_toolbar: 'image',
	},
};

const defaultData = {
	title: '',
	mainImage: '',
	content: '',
};

export const PostCreate = () => {
	const { darkTheme, onAlert } = useOutletContext();
	const navigate = useNavigate();
	const { state } = useLocation();

	const [previousData, setPreviousData] = useState(
		state?.data
			? {
					...state.data,
					title: escaping(state.data.title),
				}
			: defaultData,
	);

	const [data, setData] = useState(
		state?.data
			? {
					...state.data,
					title: escaping(state.data.title),
				}
			: defaultData,
	);
	const [firstCreatePostId, setFirstCreatePostId] = useState(null);
	const [activeUpload, setActiveUpload] = useState(
		data.mainImage === '' ? false : true,
	);

	const [publishing, setPublishing] = useState(false);
	const [saving, setSaving] = useState(null);

	const [loadCount, setLoadCount] = useState(0);

	const timer = useRef(null);

	const contentRef = useRef(null);
	const titleRef = useRef(null);
	const mainImageRef = useRef(null);

	const handleActiveUpload = () => setActiveUpload(!activeUpload);

	const handlePublish = async () => {
		const handleUpdate = async () => {
			setPublishing(true);

			const result = await updatePost({
				data: { publish: true },
				postId: firstCreatePostId || state.postId,
			});

			const handleSuccess = () => {
				onAlert({
					message: `${data.title} Published`,
					error: false,
				});
				navigate('/');
			};

			result.success
				? handleSuccess()
				: onAlert({ message: result.message, error: true });

			setPublishing(false);
		};

		!saving && (await handleUpdate());
	};

	useEffect(() => {
		const handleSetPost = async () => {
			onAlert({ message: 'Saving post...' });
			setSaving(true);
			setPreviousData(data);
			const obj = {};
			data.title !== previousData.title && (obj.title = data.title);
			data.mainImage !== previousData.mainImage &&
				(obj.mainImage = data.mainImage);
			data.content !== previousData.content && (obj.content = data.content);

			const result =
				firstCreatePostId || state?.postId
					? await updatePost({
							data: obj,
							postId: firstCreatePostId || state?.postId,
						})
					: await createPost({
							data: obj,
						});

			result.success
				? !firstCreatePostId &&
					!state?.postId &&
					setFirstCreatePostId(result.data.post.id)
				: onAlert({ message: result.message, error: true });

			setSaving(false);
			onAlert({ message: 'Auto save post' });
		};

		!saving &&
			!isEqual(data, previousData) &&
			!isEqual(data, defaultData) &&
			(timer.current = setTimeout(() => handleSetPost(), 2000));

		return () => {
			clearTimeout(timer.current);
		};
	}, [firstCreatePostId, state, saving, data, previousData, onAlert]);

	return (
		<div className={styles['post-create']}>
			<div className={styles['button-wrap']}>
				<Link to="/" className={styles.link}>
					<span className={`${styles['left-arrow']} ${imageStyles.icon}`} />
					Back to Dashboard
				</Link>
				{(firstCreatePostId || state?.publish === false) && (
					<button className={buttonStyles.success} onClick={handlePublish}>
						{publishing ? 'Publishing' : 'Publish'}
					</button>
				)}
			</div>
			<div className={styles.container}>
				<div
					className={`${styles.editors}  ${
						loadCount < 3 ? styles.loading : ''
					}`}
				>
					<Editor
						id="editor-title"
						key={darkTheme}
						apiKey="pij84itqipqt5x0yzq0178p8ujv9yddap26oyc410q1yyrxr"
						onInit={(_evt, editor) => {
							loadCount < 3 && setLoadCount(loadCount => loadCount + 1);
							titleRef.current = editor;
							isEqual(data, defaultData) && editor.focus();
						}}
						tagName="h2"
						onEditorChange={(value, editor) => {
							const wordCountLimit = 100;
							const titleWordCount =
								editor.plugins.wordcount.body.getCharacterCountWithoutSpaces();
							titleWordCount <= wordCountLimit
								? setData({ ...data, title: value })
								: setData({ ...data });
						}}
						value={data.title}
						init={{
							entity_encoding: 'raw',
							skin: darkTheme ? 'oxide-dark' : 'oxide',
							placeholder: 'The post title...',
							menubar: false,
							toolbar: false,
							inline: true,
							plugins: 'wordcount',
							paste_as_text: true,
						}}
					/>
					<div
						className={`${styles['image-wrap']} ${
							activeUpload ? styles['show-upload'] : ''
						}`}
					>
						<button
							className={styles['upload-btn']}
							onClick={handleActiveUpload}
						>
							{data.mainImage === ''
								? 'Upload main image'
								: `${activeUpload ? 'Hide' : 'Show'} main image`}
							<span className={`${styles['down-arrow']} ${imageStyles.icon}`} />
						</button>
						<div className={styles['main-image-wrap']}>
							<div
								className={`${styles['main-image']} 
							${data.mainImage === '' ? styles.hide : ''}
							`}
							>
								<button
									onClick={() => {
										mainImageRef.current.execCommand('mceImage');
									}}
								>
									<div className={styles['button-text']}>
										<span>Set Main Image Source</span>
										<span>{'( only jpeg, png, webp )'}</span>
									</div>
								</button>
								<Editor
									id="editor-image"
									onInit={(_evt, editor) => {
										setLoadCount(loadCount => loadCount + 1);
										mainImageRef.current = editor;
									}}
									onEditorChange={(value, editor) => {
										setData({
											...data,
											mainImage: value,
										});
										editor.hide();
										editor.show();
									}}
									value={data.mainImage}
									onNodeChange={(evt, editor) => {
										const target = evt.element;

										const handleImage = url => {
											const image = new Image();

											image.onerror = () => {
												target.remove();
												setData({
													...data,
													mainImage: '',
												});

												editor.hide();
												editor.show();
											};

											image.src = url;
										};

										target.nodeName === 'IMG' && handleImage(target.src);
									}}
									init={{
										inline: true,
										menubar: false,
										toolbar: false,
										plugins: ['image', 'quickbars'],
										image_uploadtab: false,
										image_dimensions: false,
										image_description: false,
										object_resizing: false,
										typeahead_urls: false,
										quickbars_selection_toolbar: false,
										quickbars_insert_toolbar: false,
										quickbars_image_toolbar: 'image',
									}}
									onKeyDown={() => false}
									onPaste={() => false}
								/>
							</div>
						</div>
					</div>
					<Editor
						id="editor-content"
						onInit={(_evt, editor) => {
							setLoadCount(loadCount => loadCount + 1);
							contentRef.current = editor;
						}}
						onEditorChange={(value, editor) => {
							const wordCountLimit = 8000;
							const newLineCount =
								value
									?.match(/(?<=>)[^<>\n]+(?=<)/g)
									?.join(' ')
									?.replace(/\s/g, '')
									?.match(/(?<=)&nbsp;(?=)/g) ?? [];
							const contentWordCount =
								editor.plugins.wordcount.body.getCharacterCountWithoutSpaces() +
								newLineCount.length;

							contentWordCount <= wordCountLimit
								? setData({ ...data, content: value })
								: setData({ ...data });
						}}
						onObjectResized={evt => {
							evt.target.setAttribute(
								'style',
								`width:${evt.width}px;height:${evt.height}px;`,
							);
						}}
						onNodeChange={evt => {
							const target = evt.element;

							const handleImage = url => {
								const isSetStyle = target.hasAttribute('style');
								const width = target.getAttribute('width');
								const height = target.getAttribute('height');

								!isSetStyle &&
									target.setAttribute(
										'style',
										`width:${width}px;height:${height}px;`,
									);

								const image = new Image();

								image.onerror = () => {
									target.remove();
									setData({
										...data,
										content: contentRef.current.getContent(),
									});
								};

								image.src = url;
							};

							target.nodeName === 'IMG' && handleImage(target.src);
						}}
						value={data.content}
						init={{
							placeholder: 'The post content...',
							inline: true,
							menubar: false,
							toolbar: false,
							plugins: [
								'quickbars',
								'image',
								'codesample',
								'link',
								'lists',
								'wordcount',
							],
							...editorContentInit.selection_toolbar,
							...editorContentInit.insert_toolbar,
							...editorContentInit.image_toolbar,
							paste_as_text: true,
						}}
					/>
				</div>
				{loadCount < 3 && <Loading text={'Loading...'} />}
			</div>
		</div>
	);
};
