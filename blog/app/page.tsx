import Link from 'next/link';
import Image from 'next/image';

const HomePage = () => {
  // Sample data - replace with your actual data fetching logic
  const featuredPosts = [
    {
      id: 1,
      title: 'test1',
      excerpt: 'Discover how mindfulness can transform your daily routine and bring peace to your life.',
      category: 'Lifestyle',
      date: 'May 15, 2023',
      readTime: '5 min read',
      image: '/images/mindful-living.jpg',
      slug: 'test1'
    },
    {
      id: 2,
      title: 'test2',
      excerpt: 'How to explore the world while minimizing your environmental impact.',
      category: 'Travel',
      date: 'June 2, 2023',
      readTime: '8 min read',
      image: '/images/sustainable-travel.jpg',
      slug: 'test2'
    },
    {
      id: 3,
      title: 'test3',
      excerpt: 'Delicious and easy recipes to start your plant-based journey.',
      category: 'Food',
      date: 'June 10, 2023',
      readTime: '6 min read',
      image: '/images/plant-based.jpg',
      slug: 'test3'
    }
  ];

  const categories = [
    { name: 'Travel', count: 24, icon: '✈️' },
    { name: 'Food', count: 18, icon: '🍴' },
    { name: 'Lifestyle', count: 32, icon: '🌿' },
    { name: 'Technology', count: 15, icon: '💻' },
    { name: 'Health', count: 21, icon: '❤️' },
    { name: 'Books', count: 12, icon: '📚' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">Welcome to WanderWords</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover inspiring stories, practical tips, and fresh perspectives on travel, lifestyle, and more.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/blog" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-300">
              Explore Blog
            </Link>
            <Link href="/about" className="border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition duration-300">
              About Me
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 origin-top-left"></div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 relative">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2 hover:text-indigo-600 transition-colors duration-300">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/view" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300">
              View All Posts
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                href={`/category/${category.name.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300 hover:bg-indigo-50 group"
              >
                <div className="text-3xl mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                  {category.icon}
                </div>
                <h3 className="font-medium text-lg mb-1 group-hover:text-indigo-600 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-500 text-sm">{category.count} posts</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get the latest posts delivered right to your inbox along with exclusive content.
          </p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none text-gray-800"
            />
            <button className="bg-indigo-800 hover:bg-indigo-900 px-6 py-3 rounded-r-lg font-medium transition duration-300">
              Subscribe
            </button>
          </div>
          <p className="text-sm mt-3 opacity-80">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-indigo-100">
                <Image 
                  src="/images/author.jpg" 
                  alt="Author"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="md:w-2/3 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">Hello, I'm Sarah</h2>
              <p className="text-lg mb-4">
                Welcome to my corner of the internet! I'm a passionate traveler, food enthusiast, and mindfulness practitioner. 
                I started this blog to share my experiences and the lessons I've learned along the way.
              </p>
              <p className="text-lg mb-6">
                When I'm not writing, you can find me hiking in the mountains, experimenting in the kitchen, 
                or curled up with a good book and a cup of tea.
              </p>
              <Link href="/about" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300">
                Read My Story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;