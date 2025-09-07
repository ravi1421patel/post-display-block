import { useSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  TextControl,
  SelectControl
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const {
    category,
    numberOfPosts,
    showTitle,
    showThumbnail,
    showExcerpt,
    showContent,
    showMeta
  } = attributes;

  const categories = useSelect((select) =>
    select('core').getEntityRecords('taxonomy', 'category', { per_page: -1 })
  );

  const posts = useSelect((select) =>
    select('core').getEntityRecords('postType', 'post', {
      per_page: numberOfPosts,
      categories: category ? [category] : undefined,
	  _embed: true
    })
  );

  return (
    <>
      <InspectorControls>
        <PanelBody title="Post Settings">
          <SelectControl
            label="Category"
            value={category}
            options={(categories || []).map((cat) => ({
              label: cat.name,
              value: cat.id
            }))}
            onChange={(value) => setAttributes({ category: parseInt(value) })}
          />
          <TextControl
            label="Number of Posts"
            type="number"
            value={numberOfPosts}
            onChange={(value) => setAttributes({ numberOfPosts: parseInt(value) })}
          />
        </PanelBody>
        <PanelBody title="Display Fields">
          <ToggleControl
            label="Show Title"
            checked={showTitle}
            onChange={(value) => setAttributes({ showTitle: value })}
          />
          <ToggleControl
            label="Show Thumbnail"
            checked={showThumbnail}
            onChange={(value) => setAttributes({ showThumbnail: value })}
          />
          <ToggleControl
            label="Show Excerpt"
            checked={showExcerpt}
            onChange={(value) => setAttributes({ showExcerpt: value })}
          />
          <ToggleControl
            label="Show Content"
            checked={showContent}
            onChange={(value) => setAttributes({ showContent: value })}
          />
          <ToggleControl
            label="Show Meta"
            checked={showMeta}
            onChange={(value) => setAttributes({ showMeta: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div className="wp-block post-preview">
        {posts ? (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              {showTitle && <h3>{post.title.rendered}</h3>}
              {showThumbnail && post.featured_media && (
                <img
                  src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                  alt={post.title.rendered}
                  style={{ maxWidth: '100%' }}
                />
              )}
              {showExcerpt && <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />}
              {showContent && <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />}
              {showMeta && (
                <small>
                  Published on: {new Date(post.date).toLocaleDateString()}
                </small>
              )}
            </div>
          ))
        ) : (
          <p>Loading posts...</p>
        )}
      </div>
    </>
  );
}
