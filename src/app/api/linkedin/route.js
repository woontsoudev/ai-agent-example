import { chromium } from 'playwright';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to LinkedIn login page
    await page.goto('https://www.linkedin.com/login');

    // Perform login (Replace with your credentials)
    await page.fill('#username', process.env.NEXT_PUBLIC_LINKEDIN_USERNAME);
    await page.fill('#password', process.env.NEXT_PUBLIC_LINKEDIN_PASSWORD);
    await page.click('.btn__primary--large');
    await page.waitForTimeout(30000);

    // Go to LinkedIn feed
    await page.goto('https://www.linkedin.com/feed/');

    await page.waitForTimeout(10000);
    // await page.getByText('show more feed updates').scrollIntoViewIfNeeded();
    // Scroll down multiple times to load more posts
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 1000); // Scroll down by 1000 pixels
      await page.waitForTimeout(2000); // Wait for content to load
    }

    await page.waitForTimeout(5000);

    // Extract post content
    const posts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.scaffold-finite-scroll__content > div'))
        .slice(0, 5) // Get only the first 5 posts
        .map(post => {
          const text = post.innerText;
          const postId = post.getAttribute('data-id');
          return { text, postId };
        });
    });

    await browser.close();

    // Return scraped posts
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
    return NextResponse.json({ error: 'Failed to scrape LinkedIn' }, { status: 500 });
  }
}
