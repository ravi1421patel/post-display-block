<?php
/**
 * Plugin Name:       Post Display Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       post-display-block
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function render_post_display_block( $attributes ) {
    $args = [
        'post_type'      => 'post',
        'posts_per_page' => $attributes['numberOfPosts'] ?? 5,
    ];

    if ( ! empty( $attributes['category'] ) ) {
        $args['category_name'] = $attributes['category'];
    }

    $query = new WP_Query( $args );
    $output = '<div class="wp-block-post-display-block">';

    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $output .= '<div class="post-item">';

            if ( ! empty( $attributes['showTitle'] ) ) {
                $output .= '<h3 class="post-title">' . esc_html( get_the_title() ) . '</h3>';
            }

            if ( ! empty( $attributes['showThumbnail'] ) && has_post_thumbnail() ) {
                $output .= '<div class="post-thumbnail">' . get_the_post_thumbnail( get_the_ID(), 'medium' ) . '</div>';
            }

            if ( ! empty( $attributes['showExcerpt'] ) ) {
                $output .= '<p class="post-excerpt">' . esc_html( get_the_excerpt() ) . '</p>';
            }

            if ( ! empty( $attributes['showContent'] ) ) {
                $output .= '<div class="post-content">' . wp_kses_post( get_the_content() ) . '</div>';
            }

            if ( ! empty( $attributes['showMeta'] ) ) {
                $output .= '<div class="post-meta">';
                $output .= '<span class="post-date">Published on: ' . esc_html( get_the_date() ) . '</span>';
                $output .= '<span class="post-author"> by ' . esc_html( get_the_author() ) . '</span>';
                $output .= '</div>';
            }

            $output .= '</div>'; // .post-item
        }
        wp_reset_postdata();
    } else {
        $output .= '<p>No posts found.</p>';
    }

    $output .= '</div>'; // .wp-block-post-display-block
    return $output;
}
function post_display_block_register() {
    register_block_type( __DIR__ . '/build', [
        'render_callback' => 'render_post_display_block',
    ] );
}
add_action( 'init', 'post_display_block_register' );