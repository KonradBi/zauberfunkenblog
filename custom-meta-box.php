<?php
/**
 * Plugin Name: Translation ID Meta Box
 * Description: Fügt ein Meta-Feld für Translation ID zu Beiträgen hinzu
 * Version: 1.0
 * Author: Zauberfunken Blog
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Fügt die Meta-Box hinzu
 */
function add_translation_id_meta_box() {
    add_meta_box(
        'translation_id_meta_box',
        'Translation ID',
        'render_translation_id_meta_box',
        'post', // Post-Typ
        'side', // Position
        'high' // Priorität
    );
}
add_action('add_meta_boxes', 'add_translation_id_meta_box');

/**
 * Zeigt den Inhalt der Meta-Box an
 */
function render_translation_id_meta_box($post) {
    // Sicherheits-Nonce erstellen
    wp_nonce_field('translation_id_meta_box', 'translation_id_meta_box_nonce');

    // Den aktuellen Wert holen
    $value = get_post_meta($post->ID, 'translation_id', true);

    // Das Eingabefeld anzeigen
    ?>
    <p>
        <label for="translation_id_field">
            <?php _e('Gib eine ID ein, um Übersetzungen zu verknüpfen. Verwende dieselbe ID für Beiträge in verschiedenen Sprachen, die einander entsprechen.', 'zauberfunken'); ?>
        </label>
        <br>
        <input type="text" id="translation_id_field" name="translation_id_field" value="<?php echo esc_attr($value); ?>" style="width:100%" />
    </p>
    <?php
}

/**
 * Speichert die Meta-Box-Daten
 */
function save_translation_id_meta_box_data($post_id) {
    // Überprüfen, ob wir nicht speichern sollen
    if (!isset($_POST['translation_id_meta_box_nonce'])) {
        return;
    }

    // Überprüfen, ob der Nonce gültig ist
    if (!wp_verify_nonce($_POST['translation_id_meta_box_nonce'], 'translation_id_meta_box')) {
        return;
    }

    // Überprüfen, ob es sich um einen Autosave handelt
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Überprüfen der Benutzerberechtigungen
    if (isset($_POST['post_type']) && 'post' === $_POST['post_type']) {
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
    }

    // Daten speichern
    if (isset($_POST['translation_id_field'])) {
        update_post_meta($post_id, 'translation_id', sanitize_text_field($_POST['translation_id_field']));
    }
}
add_action('save_post', 'save_translation_id_meta_box_data');

/**
 * Das Meta-Feld in der REST API anzeigen
 */
function register_translation_id_in_rest_api() {
    register_rest_field('post', 'translation_id', array(
        'get_callback' => function($post) {
            return get_post_meta($post['id'], 'translation_id', true);
        },
        'update_callback' => function($value, $post) {
            return update_post_meta($post->ID, 'translation_id', $value);
        },
        'schema' => array(
            'description' => __('Translation ID for connecting posts in different languages', 'zauberfunken'),
            'type'        => 'string',
            'context'     => array('view', 'edit')
        ),
    ));
}
add_action('rest_api_init', 'register_translation_id_in_rest_api'); 