import { getCliClient } from 'sanity/cli'
import { createReadStream } from 'fs'
import { join } from 'path'
import process from 'process'
const client = getCliClient({apiVersion: '2024-01-01'})
const aboutData = {
    _type: 'aboutPage',
    bioParagraph1: '<span class="drop-cap">B</span>eenu Kumar Taneja is a <span class="text-highlight">highly respected corporate trainer</span>, entrepreneur, and leadership development expert who has made a <span class="text-highlight">powerful impact</span> in the field of professional training and organisational transformation in India. With <span class="text-highlight font-medium">over 19 years of professional experience</span>, including 17 years dedicated to training and development, he has established himself as a <span class="text-highlight">thought leader</span> in leadership development, behavioural skills, and performance enhancement across diverse industries.',
    bioParagraph2: 'Known for his <span class="text-highlight italic">practical, empathetic, and insight-driven approach</span>, Beenu focuses on transforming individuals and teams through engaging learning experiences that go <span class="text-highlight">far beyond traditional lecture-based training</span>. In 2012, he founded <span class="text-highlight font-bold">Getting Roots Coaching & Training Pvt. Ltd.</span>, a dynamic platform that delivers customised training solutions designed to unlock human potential and drive organisational growth.',
    bioParagraph3: 'Based in Delhi, India, and born on 29 June 1985, Beenu continues to <span class="text-highlight">strengthen his academic foundation</span> by pursuing a <span class="font-medium">Ph.D., MBA, and BBA</span> from Amity University while inspiring professionals and organisations to achieve meaningful and lasting success.',
    quoteLine1: 'Life is not complicated by <span class="quote-highlight">circumstances</span>; it is complicated by <span class="quote-highlight">overthinking</span>.',
    quoteLine2: '<span class="quote-highlight">Clarity</span> of mind turns chaos into <span class="quote-highlight">direction</span>.',
    visionStatement: 'Delivering and managing trained, future-ready human resources to fulfill the ever-growing need of a well-groomed, highly productive workforce for <span class="vision-highlight">nation building</span>.',
    missionPoints: [
        'Help organizations to identify talent; and nurture, manage and retain them to foster sustainable growth.',
        'Help educational institutions meet the ever-growing industry requirements by ensuring continuous supply of industry ready resources.',
        'Transform and empower youth and making them future ready.',
        'Effectively address the biggest challenge to the nation – the <strong class="text-light">Education-Employment Gap</strong>.'
    ],
    policies: [
        '<strong style="color: var(--text-light); font-weight: 700;">Getting Roots</strong> ensures that there is a proper flow of Honesty with Integrity.',
        '<strong style="color: var(--text-light); font-weight: 700;">Getting Roots</strong> Promote People, Clients & Employees as the first priority.',
        '<strong style="color: var(--text-light); font-weight: 700;">Getting Roots</strong> upholds the belief in diversity and inclusion with equitable pay practices for All Round Growth.',
        '<strong style="color: var(--text-light); font-weight: 700;">Getting Roots</strong> regularly reviews the feedback and is committed for delivering quality workshops across all levels.'
    ]
};
const experienceData = [
    { title: 'Director', company: 'Getting Roots Coaching & Training Pvt. Ltd.', date: '2012 - Present', icon: 'fas fa-star', gold: true, order: 1 },
    { title: 'Training Consultant', company: 'Independent Coach', date: '2010 - 2012', icon: 'fas fa-briefcase', gold: true, order: 2 },
    { title: 'Lead Trainer (SPOC)', company: 'Hero MindMine Institute', date: '2007 - 2010', icon: 'fas fa-user-tie', gold: true, order: 3 },
    { title: 'Resolution Expert', company: 'Dell International', date: '2006 - 2007', icon: 'fas fa-award', gold: true, order: 4 },
    { title: 'D.T. Faculty', company: 'DSEU, BMU, etc.', date: 'Academic', icon: 'fas fa-chalkboard-teacher', gold: false, order: 5 },
    { title: 'Gen Sec.', company: 'Greeting Lives Foundation', date: 'NGO', icon: 'fas fa-hands-helping', gold: false, order: 6 },
    { title: 'Adjunct Faculty', company: 'IMT Ghaziabad', date: 'Visiting', icon: 'fas fa-university', gold: false, order: 7 },
    { title: 'Training Partner', company: 'IIPI , ICAI', date: 'Partner', icon: 'fas fa-handshake', gold: false, order: 8 },
    { title: 'PSU Engagement', company: 'BEL, RSDC, BSES, ITPO', date: 'Corporate', icon: 'fas fa-building', gold: false, order: 9 },
    { title: 'Trainer', company: 'LPU, BMU, SRM, IMT Ghaziabad', date: 'Mentor', icon: 'fas fa-graduation-cap', gold: false, order: 10 },
    { title: 'School Training', company: '100+ Schools Worldwide', date: 'Schools', icon: 'fas fa-school', gold: false, order: 11 },
    { title: 'Global Reach', company: '100,000+ Lives Transformed', date: 'Impact', icon: 'fas fa-globe', gold: true, order: 12 }
];
const initiativesData = [
    { name: 'Getting Roots Coaching & Training Pvt. Ltd.', role: 'Director', desc: 'Building strong futures from the ground up through mindset development and skill-building. We transform potential into impact by rooting individuals in excellence and ethical values.', link: 'https://www.gettingroots.com', imageFile: 'getting roots.jpg', order: 1 },
    { name: 'Greeting Lives Foundation', role: 'General Secretary', desc: 'A purpose-driven organization uplifting communities through grassroots education and leadership. We empower individuals to transform their futures and build lasting self-reliance.', link: 'https://www.greetinglivesfoundation.org', imageFile: 'greeting lives.jpg', order: 2 },
    { name: 'Project HELP Global', role: 'Co-Founder', desc: 'An international mentorship program guiding students and young professionals toward clarity and confidence. We focus on holistic leadership and career direction for global success.', link: 'https://www.projecthelpglobal.com', imageFile: 'project help.jpg', order: 3 }
];
async function runMigrate() {
    console.log("Creating About Page...");
    await client.create(aboutData);
    console.log("Creating Experience Milestones...");
    for (let e of experienceData) {
        await client.create({
            _type: 'experienceMilestone',
            title: e.title,
            company: e.company,
            dateRange: e.date,
            icon: e.icon,
            isGold: e.gold,
            order: e.order
        });
        console.log("Created: " + e.title);
    }
    console.log("Creating Initiatives...");
    for (let i of initiativesData) {
        const filePath = join(process.cwd(), '../assets/images', i.imageFile);
        try {
            const asset = await client.assets.upload('image', createReadStream(filePath), { filename: i.imageFile });
            await client.create({
                _type: 'initiative',
                name: i.name,
                role: i.role,
                description: i.desc,
                linkUrl: i.link,
                image: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: asset._id }
                },
                order: i.order
            });
            console.log("Created Initiative: " + i.name);
        } catch (e) {
            console.error(`Failed: ${i.imageFile}`, e.message);
        }
    }
    console.log("MIGRATION COMPLETE!");
}
runMigrate().catch(console.error);