import { getCliClient } from 'sanity/cli'
import { createReadStream } from 'fs'
import { join } from 'path'
import process from 'process'
const client = getCliClient({apiVersion: '2024-01-01'})
const settingsData = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    phone: '8743088888',
    email: 'beenu.taneja@gmail.com',
    location: 'New Delhi, India',
    socialLinks: {
        instagram: 'https://www.instagram.com/beenu.taneja/?hl=en',
        facebook: 'https://p.facebook.com/beenutaneja/',
        twitter: 'https://x.com/TanejaBeenu',
        linkedin: 'https://www.linkedin.com/in/beenutaneja/',
        imdb: 'https://m.imdb.com/name/nm16918036/bio/?ref_=nm_ov_ql_1'
    },
    footerText: 'Empowering individuals and organizations for over 19 years through transformative coaching, motivational speaking, and corporate leadership development.',
    ctaHeading: 'Ready to elevate your journey?',
    ctaSubtext: "Let's collaborate to create lasting impact through leadership and excellence."
};
const expertiseData = {
    _id: 'expertisePage',
    _type: 'expertisePage',
    facultyRoles: [
        'BML Munjal University',
        'DSEU (Delhi Skill & Ent.)',
        'Kumaun University',
        'IMT Ghaziabad (Adjunct Faculty)',
        'SRM University'
    ],
    trainingCategories: [
        {
            _key: 'tc1',
            title: 'Leadership & EQ',
            icon: 'fas fa-lightbulb',
            badges: ['Emotional Intelligence', 'Leadership Development', 'Managerial Effectiveness', 'NLP & Coaching', 'Team Building']
        },
        {
            _key: 'tc2',
            title: 'Professional Skills',
            icon: 'fas fa-pen-fancy',
            badges: ['Business Writing', 'Negotiation Skills', 'Design Thinking', 'Strategic Risk', 'Clarity & Focus']
        }
    ],
    certifications: [
        { _key: 'c1', title: 'Certified Coach', subtitle: 'Manufacturing & IT focus' },
        { _key: 'c2', title: 'EFT Practitioner', subtitle: 'VLC, London' },
        { _key: 'c3', title: 'NLP Certification', subtitle: 'Hero MindMine (Country Head)' },
        { _key: 'c4', title: 'Risk Management', subtitle: 'Wipro Ltd.' }
    ],
    placementTitle: 'Placement Training',
    placementDesc: 'Bridging academia and industry. Transforming students into job-ready professionals through <span class="text-highlight">personality enhancement</span> and <span class="text-highlight">soft skills</span> modules.',
    placementFooter: 'Incubating Next-Gen Entrepreneurs'
};
const pressData = [
    { headline: 'Bharat Media', publisher: 'Bharat Media', link: 'https://bharatmediatoday.com/beenu-kumar-taneja-corporate-trainer-india/', file: 'bharat media.png' },
    { headline: 'IMDB Profile', publisher: 'IMDB', link: 'https://m.imdb.com/name/nm16918036/bio/?ref_=nm_ov_ql_1', file: 'imdb.png' },
    { headline: 'Knowledge Pedia', publisher: 'Knowledge Pedia', link: '#', file: 'knowledge .png' },
    { headline: 'Emerging Personalities and Brands to Watch in 2026', publisher: 'Mid Day', link: 'https://www.mid-day.com/brand-stories/business-and-service/article/emerging-personalities-and-brands-to-watch-in-2026-8845', file: 'mid day.png' },
    { headline: 'Reporter Live', publisher: 'Reporter Live', link: 'https://areporterlive.com/beenu-kumar-taneja-corporate-trainer-india/', file: 'reporter live.png' },
    { headline: 'Beenu Kumar Taneja: A Visionary Leader in Corporate Training and Coaching', publisher: 'IANS Wire', link: 'https://www.ians.in/vmpl/beenu-kumar-taneja-a-visionary-leader-in-corporate-training-and-coaching', file: 'INAS WIRE .png' },
    { headline: 'A Dynamic and Shining Star in the Field of Corporate Training and Coaching', publisher: 'Dainik Bhaskar', link: 'https://dainikbhaskarup.com/beenu-kumar-taneja-a-dynamic-and-shining-star-in-the-field-of-corporate-training-and-coaching/', file: 'danik bhaskar.png' }
];
async function runMigrate() {
    console.log("Creating Site Settings...");
    await client.createOrReplace(settingsData);
    console.log("Creating Expertise Page...");
    await client.createOrReplace(expertiseData);
    console.log("Fetching existing initiatives to patch bullets...");
    const initiatives = await client.fetch('*[_type == "initiative"]');
    for (let init of initiatives) {
        if (init.name.includes("Getting Roots")) {
            await client.patch(init._id).set({bulletPoints: ['Corporate Transformation', 'Leadership Coaching', 'Behavioral Skill Training']}).commit();
        } else if (init.name.includes("Greeting Lives")) {
            await client.patch(init._id).set({bulletPoints: ['"Adopt a Tree" Environment Program', 'Child Rights & Education', 'Social Disparity Eradication']}).commit();
        } else if (init.name.includes("Project HELP")) {
            await client.patch(init._id).set({bulletPoints: ['Plagiarism-Free Content', 'On-time Delivery', 'Expert-Reviewed Work']}).commit();
        }
        console.log("Patched bullets for: " + init.name);
    }
    console.log("Creating Press Releases / Featured Articles...");
    for (let p of pressData) {
        const filePath = join(process.cwd(), '../assets/featured in ', p.file);
        try {
            const asset = await client.assets.upload('image', createReadStream(filePath), { filename: p.file });
            await client.create({
                _type: 'featuredArticle',
                headline: p.headline,
                publisher: p.publisher,
                link: p.link,
                image: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: asset._id }
                }
            });
            console.log("Created Press Release: " + p.publisher);
        } catch (e) {
            console.error(`Failed to process ${p.file}:`, e.message);
        }
    }
    console.log("FINAL MIGRATION COMPLETE!");
}
runMigrate().catch(console.error);