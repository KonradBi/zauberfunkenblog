import { NextResponse } from 'next/server';
import { getPosts, testApiConnection, getCategories } from '@/lib/wordpress-api';

export async function GET() {
  try {
    // Test the API connection first
    console.log('Testing WordPress API connection...');
    const connectionTest = await testApiConnection();
    
    if (!connectionTest.success) {
      console.error('API connection test failed:', connectionTest.error);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to connect to WordPress API',
        error: connectionTest.error
      }, { status: 500 });
    }
    
    console.log('API connection successful, fetching posts...');
    
    // If connection is successful, try to fetch categories first (usually smaller response)
    const categories = await getCategories('de');
    
    // Then fetch posts
    const posts = await getPosts(undefined, 1, 5, 'de');
    
    return NextResponse.json({ 
      success: true,
      apiInfo: connectionTest.data,
      categories: categories,
      posts: posts
    });
  } catch (error) {
    console.error('Error in test-wordpress API route:', error);
    let errorMessage = 'Unknown error';
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack
      };
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    } else {
      errorMessage = String(error);
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Error testing WordPress API',
      error: errorMessage,
      errorDetails: errorDetails
    }, { status: 500 });
  }
}
