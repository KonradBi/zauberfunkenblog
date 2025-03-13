<?php
/**
 * Zauberfunken Theme Funktionen und Definitionen
 */

// Styles des Parent-Themes laden
add_action('wp_enqueue_scripts', 'zauberfunken_theme_enqueue_styles');
function zauberfunken_theme_enqueue_styles() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('child-style', get_stylesheet_uri(), array('parent-style'));
}

// REST API für Headless WordPress optimieren
add_action('rest_api_init', 'zauberfunken_theme_rest_api_init');
function zauberfunken_theme_rest_api_init() {
    // Erweitere die REST API, um zusätzliche Felder für Beiträge bereitzustellen
    register_rest_field('post', 'featured_image_url', array(
        'get_callback' => 'zauberfunken_get_featured_image_url',
        'schema' => null,
    ));
    
    // Füge Übersetzungsunterstützung hinzu (falls WPML oder ähnliches Plugin verwendet wird)
    register_rest_field('post', 'translations', array(
        'get_callback' => 'zauberfunken_get_translations',
        'schema' => null,
    ));
}

// Funktion zum Abrufen der URL des Beitragsbilds
function zauberfunken_get_featured_image_url($post) {
    if (has_post_thumbnail($post['id'])) {
        $featured_image_id = get_post_thumbnail_id($post['id']);
        $featured_image = wp_get_attachment_image_src($featured_image_id, 'full');
        return $featured_image[0];
    }
    return null;
}

// Funktion zum Abrufen von Übersetzungen (falls WPML installiert ist)
function zauberfunken_get_translations($post) {
    $translations = array();
    
    // Prüfen, ob WPML aktiv ist
    if (function_exists('icl_object_id')) {
        global $sitepress;
        $trid = $sitepress->get_element_trid($post['id'], 'post_' . $post['type']);
        $all_translations = $sitepress->get_element_translations($trid, 'post_' . $post['type']);
        
        foreach ($all_translations as $lang => $translation) {
            if ($translation->element_id != $post['id']) {
                $translations[$lang] = array(
                    'id' => $translation->element_id,
                    'slug' => get_post_field('post_name', $translation->element_id),
                    'link' => get_permalink($translation->element_id),
                );
            }
        }
    }
    
    return $translations;
}

// CORS-Header für die REST API hinzufügen, um Cross-Origin-Anfragen zu erlauben
add_action('init', 'zauberfunken_theme_add_cors_headers');
function zauberfunken_theme_add_cors_headers() {
    // Nur für REST API-Anfragen
    if (isset($_SERVER['HTTP_ORIGIN']) && strpos($_SERVER['REQUEST_URI'], '/wp-json/') !== false) {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Authorization, Content-Type");
        
        // Bei OPTIONS-Anfragen sofort beenden
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            status_header(200);
            exit();
        }
    }
}

// Zusätzliche Bildgrößen für responsive Darstellung registrieren
add_action('after_setup_theme', 'zauberfunken_theme_image_sizes');
function zauberfunken_theme_image_sizes() {
    add_image_size('hero-large', 1920, 1080, true);
    add_image_size('hero-medium', 1280, 720, true);
    add_image_size('hero-small', 640, 360, true);
    add_image_size('card-thumbnail', 600, 400, true);
}

// Füge Kategorie- und Tag-Informationen zur REST API hinzu
add_filter('rest_prepare_post', 'zauberfunken_theme_rest_prepare_post', 10, 3);
function zauberfunken_theme_rest_prepare_post($response, $post, $request) {
    // Kategorie-Informationen hinzufügen
    $categories = get_the_category($post->ID);
    $category_data = array();
    
    foreach ($categories as $category) {
        $category_data[] = array(
            'id' => $category->term_id,
            'name' => $category->name,
            'slug' => $category->slug,
            'link' => get_category_link($category->term_id),
        );
    }
    
    $response->data['categories_info'] = $category_data;
    
    // Tag-Informationen hinzufügen
    $tags = get_the_tags($post->ID);
    $tag_data = array();
    
    if ($tags) {
        foreach ($tags as $tag) {
            $tag_data[] = array(
                'id' => $tag->term_id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'link' => get_tag_link($tag->term_id),
            );
        }
    }
    
    $response->data['tags_info'] = $tag_data;
    
    return $response;
}
