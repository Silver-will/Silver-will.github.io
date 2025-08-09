export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    website: string;
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    website: 'https://silver-will.github.io',
    title: 'Daunte Omoregie',
    subtitle: 'Graphics programmer and game engine developer',
    description: 'Small page for my Graphics programming adventures',
    image: {
        src: '/portfolio.png',
        alt: 'Small page for my Graphics programming adventures'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Terms',
            href: '/terms'
        }
    ],
    socialLinks: [
        {
            text: 'Github',
            href: 'https://github.com/Silver-will'
        },
        {
            text: 'Linkedin',
            href: 'https://www.linkedin.com/in/daunte-o-4a596622b/'
        },
        {
            text: 'X/Twitter',
            href: 'https://twitter.com/silver_will_'
        }
    ],
    hero: {
        title: 'Hi There & Welcome to My Corner of the Web!',
        text: "I'm **Daunte omoregie**, a graphics programmer and game developer with a passion for realtime rendering, light tranport and GPU simulation software. Currently a computer engineering undergraduate, i enjoy implementing computer graphics techniques in my free time. Feel free to explore some of my coding endeavors on <a href ='https://github.com/Silver-will'>GitHub</a> or follow me on <a href = 'https://twitter.com/silver_will_'>Twitter/X </a>.",

        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
    subscribe: {
        title: 'Subscribe to my Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
