const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testImageUrls() {
  console.log('Fetching posts from API...');
  // Using the original API endpoint but without the language filter to get more posts
  const response = await fetch('http://blog.zauberfunken.com/wp-json/wp/v2/posts?per_page=5&_fields=id,title,slug,featured_media');
  const posts = await response.json();
  
  console.log(`Received ${posts.length} posts`);
  
  for (const post of posts) {
    console.log(`\nPost: ${post.id} - ${post.title.rendered}`);
    console.log(`Featured Media ID: ${post.featured_media}`);
    
    if (post.featured_media && post.featured_media !== 0) {
      try {
        // Directly fetch the media item using the media endpoint
        const mediaResponse = await fetch(`http://blog.zauberfunken.com/wp-json/wp/v2/media/${post.featured_media}`);
        const mediaItem = await mediaResponse.json();
        
        console.log('Media found:');
        console.log(`  Source URL: ${mediaItem.source_url}`);
        console.log(`  Media Type: ${mediaItem.media_type}`);
        console.log(`  Mime Type: ${mediaItem.mime_type}`);
        
        // Check thumbnails
        if (mediaItem.media_details?.sizes) {
          console.log('  Available sizes:');
          Object.keys(mediaItem.media_details.sizes).forEach(size => {
            const sizeInfo = mediaItem.media_details.sizes[size];
            console.log(`    ${size}: ${sizeInfo.source_url} (${sizeInfo.width}x${sizeInfo.height})`);
          });
        }
        
        // Test image URL
        try {
          console.log('  Testing image URL accessibility...');
          const imageResponse = await fetch(mediaItem.source_url, { method: 'HEAD' });
          console.log(`  Image URL status: ${imageResponse.status} ${imageResponse.statusText}`);
          
          // Also test a thumbnail URL if available
          if (mediaItem.media_details?.sizes?.thumbnail?.source_url) {
            const thumbUrl = mediaItem.media_details.sizes.thumbnail.source_url;
            const thumbResponse = await fetch(thumbUrl, { method: 'HEAD' });
            console.log(`  Thumbnail URL status: ${thumbResponse.status} ${thumbResponse.statusText}`);
          }
        } catch (error) {
          console.log(`  Error accessing image URL: ${error.message}`);
        }
      } catch (error) {
        console.log(`  Error fetching media: ${error.message}`);
      }
    } else {
      console.log('No featured media ID for this post');
    }
  }
}

testImageUrls().catch(console.error); 